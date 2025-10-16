import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: any = '';

  logInForm!: FormGroup;
  dynClass = 'btn btn-primary';
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authServie: AuthServiceService
  ) {
    this.logInForm = fb.group({});
  }

  signIn() {
    let reuquestBody = {
      username: this.email,
      password: this.password,
    };
    console.log(reuquestBody);
    this.authServie.login(reuquestBody).subscribe({
      next: (res) => {
        console.log(res);
        if (res.user.role.name === 'Admin') {
          this.router.navigate(['/careunit']);
        } else {
          this.router.navigate(['dashboard']);
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
