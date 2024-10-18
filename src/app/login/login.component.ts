import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  messagesService = inject(MessagesService);

  form = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage('Enter e-mail and password', 'error');
        return;
      }

      await this.authService.login(email, password);
      await this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
      this.messagesService.showMessage('Login Failed', 'error');
    }
  }
}
