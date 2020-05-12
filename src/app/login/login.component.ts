import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public error: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }

  public submit() {
    console.log("Submitted")
    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.error = false;
          this.router.navigate(['home/operations/2018/1'])
        },
        err => {
          console.log(err);
          //alert("Login Failed")
          //location.reload();
          //this.error = 'Could not authenticate'
          this.error = true;
        }  
      );
  }

}
