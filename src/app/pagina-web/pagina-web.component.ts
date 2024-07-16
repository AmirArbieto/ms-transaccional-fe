import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ContactFormService } from 'src/app/services/formulario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-web',
  templateUrl: './pagina-web.component.html',
  styleUrls: ['./pagina-web.component.css']
})
export class PaginaWebComponent {
  title = 'CETPRO';

  contactForm: any = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    numeroCelular: '',
    correo: '',
    programaEstudio: '',
    descripcion: ''
  };

  constructor(private userService: UserService, private contactFormService: ContactFormService) {}

  onSubmit() {
    const user = {
      id: '',  // Inicializado en vacío, será manejado por el backend
      name: this.contactForm.nombre,
      lastname_paternal: this.contactForm.apellidoPaterno,
      lastname_maternal: this.contactForm.apellidoMaterno,
      birthdate: '',  // Inicializado en vacío, si no es requerido
      document_type: '',  // Inicializado en vacío, si no es requerido
      document_number: '',  // Inicializado en vacío, si no es requerido
      phone: this.contactForm.numeroCelular,
      phone_optional: '',  // Inicializado en vacío, si no es requerido
      email: this.contactForm.correo,
      status: 'A'
    };

    this.userService.crearUsuario(user).subscribe(
      responseUser => {
        const formulario = {
          id: '',  // Inicializado en vacío, será manejado por el backend
          userId: responseUser.id,
          studyProgramId: this.contactForm.programaEstudio,
          description: this.contactForm.descripcion,
          status: 'A'
        };

        this.contactFormService.crearFormulario(formulario).subscribe(
          responseFormulario => {
            Swal.fire('Formulario enviado', 'Gracias por contactarnos', 'success');
            this.resetForm();
          },
          error => {
            console.error('Error al enviar el formulario', error);
            Swal.fire('Error', 'Hubo un error al enviar el formulario', 'error');
          }
        );
      },
      error => {
        console.error('Error al crear el usuario', error);
        Swal.fire('Error', 'Hubo un error al crear el usuario', 'error');
      }
    );
  }
  onCelularChange(celular: string) {
    this.userService.obtenerUserPorCelular(celular).subscribe(
      (userData) => {
        this.contactForm.nombre = userData.name;
        this.contactForm.apellidoPaterno = userData.lastname_paternal;
        this.contactForm.apellidoMaterno = userData.lastname_maternal;
        this.contactForm.correo = userData.email;
      
        // Puedes rellenar otros campos según los datos obtenidos
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }


  resetForm() {
    this.contactForm = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      numeroCelular: '',
      correo: '',
      programaEstudio: '',
      descripcion: ''
    };
  }
}
