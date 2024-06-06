import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  returnUrl: string;

  listuser:any
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router:Router, private route: ActivatedRoute) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onSubmit0(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          response => {
            this.listuser = response

            if (this.listuser.success == true) {
              localStorage.setItem("userconnect", JSON.stringify(this.listuser.user) )
              localStorage.setItem("token",this.listuser.token)
              localStorage.setItem("state","0")

            console.log('Réponse du serveur:', response);
            // Redirection vers la page d'accueil après une authentification réussie
            this.router.navigate(['/']);
          }
          },
          error => {
            console.error('Erreur lors de la connexion:', error);
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }

  onSubmit(): void {

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          response => {
            this.listuser = response
            console.log('Réponse du serveur:', this.listuser);

            if (this.listuser.msg == "success") {
              localStorage.setItem("userconnect", JSON.stringify(this.listuser.user) )
              localStorage.setItem("token",this.listuser.token)
              localStorage.setItem("state","0")

              console.log('Réponse du serveur:', response);
              // Redirect to the return URL after successful login
              this.router.navigateByUrl(this.returnUrl);
            }
          },
          error => {
            console.error('Erreur lors de la connexion:', error);
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }



}
