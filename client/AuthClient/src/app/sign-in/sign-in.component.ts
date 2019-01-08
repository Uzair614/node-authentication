import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {}

  signInUser() {
    const res$ = this.auth.signIn(this.signInForm.value);
    res$.subscribe(
      response => console.log('responseConsole:  ', response),
      err => console.log('erorrsConsole:  ', err)
    );
  }
}
