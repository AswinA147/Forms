import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-newform',
  template: `<div>
  <h1>Dynamic Form</h1>
  <form  [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngFor="let data of formFields" style="margin: 1em 0"> 
          <label>{{data.name}} : </label>
          <input type="{{data.type}}" placeholder=" enter {{data.name}}" formControlName="{{data.name}}" />
      </div>
      <button type="submit" [disabled]="form.invalid" value="Submit">Submit</button>
  </form>
</div>`
})
export class NewformComponent implements OnInit {

  public inputForm!: UntypedFormGroup;

  formFields:any[] = [];
  form = new FormGroup({});

  constructor(private formBuilder: UntypedFormBuilder,private httpClient: HttpClient) { }

  ngOnInit(): void {
    
    this.httpClient.get<any[]>("/assets/FormData.json").subscribe((formFields : any)=>{
      for (const formField of formFields){
        this.form.addControl(formField.name,new FormControl('',this.getValidator(formField)));
      }
      this.formFields = formFields;
    })
  }

  getValidator(formField: any): ValidatorFn[] | null {
    let validationarray: ValidatorFn[] = [];
    for(let validationtype of formField.validation){
      if(validationtype == "required")
        validationarray.push(Validators.required);
      if(validationtype == "email")  
        validationarray.push(Validators.email);
    }
    return validationarray;
  }

  onSubmit():void {
    if(this.form.valid) console.log(this.form.value);
  }
  
}

