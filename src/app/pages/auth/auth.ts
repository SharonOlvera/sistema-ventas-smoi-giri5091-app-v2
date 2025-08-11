// src/app/pages/auth/auth.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseForm } from '../../shared/utils/base.form';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit, OnDestroy {
  hide = true;
  private destroy$ = new Subject<any>();

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private fb: FormBuilder,
    public baseForm: BaseForm,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log("init OnInit");
  }

  onLogin(): void {
    console.log("¿Formulario válido?", this.loginForm.valid);
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    // Ensure username and password are strings
    const safeUsername: string = username ?? '';
    const safePassword: string = password ?? '';

    this.authService
      .login(safeUsername, safePassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log("Inicio de sesión exitoso");
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error("Error al iniciar sesión", err);
          // Aquí podrías mostrar un mensaje al usuario con mat-error, snackbar, etc.
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}