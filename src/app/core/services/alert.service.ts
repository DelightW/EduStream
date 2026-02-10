import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      width: '350px',
      confirmButtonColor: '#2e7d32', 
    });
  }

  error(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      width: '350px',
      padding: '1.5em', 
      confirmButtonColor: '#d32f2f'
    });
  }

   confirm(title: string, message: string): Promise<boolean> {
     return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      width: '350px',
      padding: '1.5em', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2e7d32', 
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  toast(message: string, icon: 'success' | 'error' | 'warning' = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    Toast.fire({ icon: icon, title: message });
  }
}