import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-formula',
  templateUrl: './edit-formula.component.html',
  styleUrls: ['./edit-formula.component.css']
})
export class EditFormulaComponent implements OnInit {
    form_title: string = "Configure Salary Calculation Formula";
    form_group!: FormGroup;
    OrgID: string = "";
    LoggedInUserID: string = "";
    reload_page_data: Boolean = false;

    salary_earnings_list: any[] = [];
    operator_list = ['+', '-', '/', '*'];
    current_component:any = {
        "ComponentId": 1015,
        "ComponentName": "RENT_ALLOWANCE",
        "Type": "Earnings"
    };
    

    constructor(
        public dialogRef: MatDialogRef<EditFormulaComponent>,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private spinner_service: NgxSpinnerService,

        private common_http_service: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private datePipe:DatePipe
    ) {


        this.form_group = this.fb.group({
            TargetCapType: ['FixedAmount'],
            Expression: [''],
            FixedAmount: [''],
            ComponentName:[''],
            ComponentId: [''],
            SelectedEarning: [''],
            Operator: [''],
            MinSalaryLimit: [''],
            MaxSalaryLimit: [''],
            CalculationBase: [''],
            EffectiveFrom: [''],
            EffectiveTo: [''],
            HasSalaryLimit: [false],
            BetweenDates: [false],
            RuleId:['0'],
            type: ['Amount']


        });




        //if (data!=null) {
        //    this.form_group.setValue({
        //        TargetCapType: data.type,
        //        Expression: data.Expression,
        //        Amount: data.Amount,
        //        ComponentName: data.ComponentName,
        //        ComponentId: data.ComponentId,
        //        Operator: '',
        //        SelectedEarning: '',
        //        MinSalaryLimit: '',
        //        MaxSalaryLimit: '',
        //        CalculationBase: '',
        //        EffectiveFrom: '',
        //        EffectiveTo: '',
        //        HasSalaryLimit: [false],
        //        BetweenDates: [false],
        //        RuleId:[0]




               

        //    });
            
        //}

        this.LoggedInUserID = localStorage.getItem("LoggedInUserID")!;
        

    }
    ngOnInit(): void {

        this.load_earnings_local();
    }

    pre_assign_date() {
        this.form_group.get('EffectiveFrom')?.setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd"));
    }
    closeDialog() {
        this.dialogRef.close(this.form_group.value);
    }
    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
        this.dialog.open(ShowalertComponent, {
            data: { message, type },
            panelClass: 'custom-dialog',
            disableClose: true
        }).afterClosed().subscribe((res) => {
            if (res) {
              
            }
        });
    }

    onSave() {


        debugger;

        if (this.form_group.get('HasSalaryLimit')?.value === true) {
            const minAmount = Number(this.form_group.get('MinSalaryLimit')?.value || 0);
            const maxAmount = Number(this.form_group.get('MaxSalaryLimit')?.value || 0);

            if (
                minAmount > maxAmount ||
                (minAmount === 0 && maxAmount === 0)
            ) {
                // Handle invalid salary limit case
                this.ShowAlert('Invalid salary limits: min > max or both are zero.', 'warning');
                return;
            }
        }

        if (this.form_group.get('BetweenDates')?.value === true) {
            const fromDate = this.form_group.get('EffectiveFrom')?.value;
            const toDate = this.form_group.get('EffectiveTo')?.value;

            if (!fromDate || !toDate) {
                

                if (!fromDate) {

                    this.ShowAlert('From  Date is Required ', 'warning');
                    return;
                }

                if (!toDate) {

                    this.ShowAlert('To Date is Required ', 'warning');
                    return;
                }
            }


  
        }

        if (this.form_group.get('TargetCapType')?.value == "FixedAmount") {
            let amount = this.form_group.get('FixedAmount')!.value.toString();
            amount = Number(amount);
            if (amount <= 0) {
                this.ShowAlert('Fixed Amount Should be Greater than zero', 'warning');
            } else {

                this.SaveFormulaCreation();
            }

        }


        else {
            if (this.form_group.get('TargetCapType')?.value == "CustomExpression") {



                let expression = this.form_group.get('Expression')!.value;
                const result = this.validateFormula(expression, this.salary_earnings_list.map((item: any) => item.ComponentName));

                if (!result.isValid) {
               
                    this.ShowAlert('Invalid Formula : ' + (result.error as String).toString() + '', 'warning');
                    return;


                } 

                if (expression == '') {
                    this.ShowAlert('Please Check Expression', 'warning');

                } else {
                    this.SaveFormulaCreation();
                }

            }

        }

    }

    getFormulaComponentsString(formula: string): string {
        if (!formula) return '';

        const matches = formula.match(/\{([^}]+)\}/g);

        if (!matches) return '';

        const components = matches.map(match => match.replace(/[{}]/g, '').trim());

        // Return a single string with unique component names, separated by commas
        return [...new Set(components)].join(', ');
    }



    SaveFormulaCreation() {

    
        

        let api_url = "api/Salary/CreateFormula";
        let post_item = this.form_group.value;

        post_item["Expression"] = post_item.Expression.toString().replace('{', '').replace('}', '');
        post_item["CalculationBase"] = this.getFormulaComponentsString(post_item.Expression);
        post_item["IsFixedAmount"] = this.form_group.get('TargetCapType')?.value == "FixedAmount" ? this.form_group.get('type')?.value == "Amount" ? true : false : false;
     
        post_item["CapComponentSource"] = this.getFormulaComponentsString(post_item.Expression);
        post_item["CapValue"] = this.form_group.get('FixedAmount')?.value
        post_item["IsActive"] = true;
        post_item["CreatedByID"] = this.LoggedInUserID;
        post_item["CreatedDate"] = new Date();
        post_item["ComponentId"] = this.current_component.ComponentId;
        post_item["ComponentName"] = this.current_component.ComponentName;
        if (post_item["FixedAmount"] == "") {
            post_item["FixedAmount"] = "0";
        }


        if (post_item.RuleId == 0 || post_item.RuleId == "0")
        {
            post_item["ModifiedByID"] = null;
            post_item["ModifiedDate"] = null;
        } else
        {
            post_item["ModifiedByID"] = this.LoggedInUserID;
            post_item["ModifiedDate"] = new Date();

        }

        this.common_http_service.Postwithjson(api_url, post_item).subscribe({
            next: (result) => {
                if (result.Status) {
                    this.ShowAlert(result.message, 'success');
                } else {
                    this.ShowAlert(result.message, 'warning');

                }
                this.dialogRef.close(result);

            },
            error: (error) => {
                this.ShowAlert(error.message, 'error');

            }

            
        });



    }

    validateFormula(formula: string, validComponents: string[]): { isValid: boolean; error?: string } {
    if (!formula || formula.trim() === '') {
        return { isValid: false, error: 'Formula is empty.' };
    }

    let replacedFormula = '';
    const placeholderPattern = /\{([^}]+)\}/g;

    try {
        // Check for invalid/missing operators between placeholders or numbers
        let lastIndex = 0;
        replacedFormula = formula.replace(placeholderPattern, (match, p1, offset) => {
            const component = p1.trim();
            if (!validComponents.includes(component)) {
                throw new Error(`Invalid component: "${component}" is not recognized.`);
            }

            // Check what comes immediately before this placeholder
            const before = formula.slice(lastIndex, offset).trim();

            // If the previous character is not an operator or open parenthesis and this is not the first token
            if (
                before.length > 0 &&
                !/[+\-*/(]$/.test(before)
            ) {
                throw new Error(`Missing operator before component: "${component}"`);
            }

            lastIndex = offset + match.length;
            return '1'; // Replace with dummy number
        });
    } catch (error: any) {
        return { isValid: false, error: error.message };
    }

    // Allow only numbers, operators, parentheses, and spaces
    const allowedPattern = /^[0-9+\-*/().\s]+$/;
    if (!allowedPattern.test(replacedFormula)) {
        return {
            isValid: false,
            error: 'Formula contains invalid characters. Only numbers and + - * / ( ) are allowed.',
        };
    }

    try {
        // eslint-disable-next-line no-eval
        const result = eval(replacedFormula);
        if (typeof result !== 'number' || isNaN(result)) {
            return { isValid: false, error: 'Formula could not be evaluated to a number.' };
        }
    } catch {
        return {
            isValid: false,
            error: 'Formula is incomplete or has a syntax error (e.g., trailing operator).',
        };
    }

    return { isValid: true };
}

    EarningSelectionChanged() {
     
        let selected_component_name = this.form_group.get("SelectedEarning")?.value;
        selected_component_name = "{" + selected_component_name + "}";
      
        let old_value = this.form_group.get("Expression")?.value;
        this.form_group.get("Expression")?.setValue(old_value + selected_component_name);

      

    }

    OperatorSelectionChanged() {
        
        let selected_component_name = this.form_group.get("Operator")?.value;
   

        let old_value = this.form_group.get("Expression")?.value;
        this.form_group.get("Expression")?.setValue(old_value + selected_component_name);



    }


    load_earnings_local() {
        this.salary_earnings_list.push({
            "ComponentId": 13,
            "ComponentName": "FUEL_REIMBURSEMENT",
            "Type": "Earnings"
        },
        {
            "ComponentId": 1013,
            "ComponentName": "MEDICAL_ALLOWANCE",
            "Type": "Earnings"
        },
        {
            "ComponentId": 1014,
            "ComponentName": "TRAVEL_ALLOWANCE",
            "Type": "Earnings"
        },
        {
            "ComponentId": 1015,
            "ComponentName": "RENT_ALLOWANCE",
            "Type": "Earnings"
        });

    }
}
