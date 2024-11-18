let empleados = [];

// Función para cargar el contenido dinámicamente
async function loadContent(page) {
  try {
    localStorage.setItem("currentPage", page);

    const response = await fetch(`views/${page}.html`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    if (html.trim() === "") {
      throw new Error("El contenido HTML está vacío");
    }
    $("#app").html(html);
    if (page === "empleados") {
      loadEmpleados(1);
    }
  } catch (error) {
    console.log(error);

    $("#app").html(
      "<p>Error al cargar el contenido. Por favor, intente de nuevo.</p>"
    );
  }
}
// Función para manejar el login
function handleLogin() {
  $(document).on("submit", "#loginForm", function (e) {
    e.preventDefault();
    const email = sanitizarInput($("#email").val().trim());
    const password = sanitizarInput($("#password").val().trim());

    if (email && password) {
      $.ajax({
        url: "http://localhost:3000/api/login",
        method: "POST",
        data: JSON.stringify({ email, password }),
        contentType: "application/json",
        success: function (response) {
          if (response.ok === true) {
            localStorage.setItem("token", response.token);
            loadContent("empleados");
          } else {
            Swal.fire({
              title: "Oops",
              text: "Usuario o contraseña incorrectos",
              icon: "warning",
            });
          }
        },
        error: function (xhr, status, error) {
          console.error("Error de autenticación:", xhr.responseText);
          console.error("Status:", status);
          console.error("Error:", error);
        },
      });
    } else {
      alert("Por favor, ingrese usuario y contraseña");
    }
  });
}

// Función para manejar el logout
function handleLogout() {
  $(document).on("click", "#logoutBtn", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    loadContent("login");
  });
}

// Función para cargar nuevo empleados a la tabla
function loadNewPagEmpleados(valor) {
  if (valor < 0) {
    valor = 1;
  } else {
    valor += valor;
  }
  loadEmpleados(valor);
}

// Función para cargar empleados
function loadEmpleados(pag) {
  $.ajax({
    url: `http://localhost:3000/api/empleados/${pag}`,
    method: "GET",
    headers: {
      "x-token": localStorage.getItem("token"),
    },
    success: function (data) {
      empleados = data.resp.data;
      const totalEmpleados = document.getElementById("totalEmpleados");
      totalEmpleados.textContent = `Mostrando ${empleados.length} de ${data.resp.total} registros`;     

      renderEmpleados();
    },
    error: function (xhr, error) {
      console.error("Error al carga empleados:", error);
      if (xhr.status === 401) {
        localStorage.removeItem("token");
        loadContent("login");
      }
    },
  });
}

// Función para renderizar empleados
function renderEmpleados() {
  let html = "";
  empleados.forEach(function (empleado) {
    const dateOfBirth = new Date(empleado.DateOfBirth)
      .toISOString()
      .split("T")[0];

    html += `
      <tr>
        <td><input class="form-check-input checkbox-empleado" type="checkbox" data-id="${empleado.id}"></td>
        <td>${empleado.name}</td>
        <td>${empleado.surname}</td>
        <td>${dateOfBirth}</td>
        <td>${empleado.email}</td>
        <td>${empleado.rol}</td>
        <td>
          <button class="btn btn-sm btn_editar_empleado" data-id="${empleado.id}" data-employee='${JSON.stringify(empleado)}'>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"/></svg>
          </button>                    
        </td>
        <td>
          <button class="btn btn-sm btn_eliminar_empleado" data-id="${empleado.id}">
             <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="black" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"/></svg>
          </button>                    
        </td>
      </tr>
    `;
  });
  $("#empleadosList").html(html);

  $(".btn_eliminar_empleado").click(function () {
    const empleadoId = $(this).data("id");
    eliminarEmpleados(empleadoId);
  });

  $(".btn_editar_empleado").click(function () {
    const dataEmpleado = $(this).data("employee");    
    editarEmpleado(dataEmpleado);
  });
}

// Función para obtenre ID de los empleados a eliminar
function obtenerIdsSeleccionados() {
  const idsSeleccionados = [];
  $(".checkbox-empleado:checked").each(function () {
    const id = $(this).data("id");
    idsSeleccionados.push(id);
  });
  return idsSeleccionados;
}

//Función para eliminar los empleados seleccionados
function eliminarEmpleadosSeleccionados() {
  const idsEmpleados = obtenerIdsSeleccionados();
  if (idsEmpleados.length === 0) {
    Swal.fire({
      title: "Atención",
      text: "No has seleccionado ningún empleado para eliminar.",
      icon: "warning",
      confirmButtonColor: "#0D3878",
    });
    return;
  }

  eliminarEmpleados(idsEmpleados);
}

// Función para eliminar empleados
function eliminarEmpleados(ids) {
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminarlo?",
    text: "Debes confirmar la eliminación",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0D3878",
    cancelButtonColor: "#99212B",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `http://localhost:3000/api/eliminarEmpleado`,
        method: "DELETE",
        contentType: "application/json",
        headers: {
          "x-token": localStorage.getItem("token"),
        },
        data: JSON.stringify({ ids }),
        success: function (data) {
          if (data.ok === true) {
            loadEmpleados(1);
            Swal.fire({
              text: `Los empleados fueron eliminados exitosamente`,
              icon: "success",
              confirmButtonColor: "#0D3878",
            });
          } else {
            Swal.fire({
              title: "Oops",
              text: "No fue posible eliminar los empleados",
              icon: "warning",
              confirmButtonColor: "#99212B",
            });
          }
        },
        error: function (err) {
          console.error("Error deleting employee:", err);
          alert("Error al eliminar el empleado: " + err);
        },
      });
    }
  });
}

// Función para agregar nuevo empleado
function newEmpleado() {  

  loadContent("empleado");
  rolesEmpleado();

  const btnCancelar = document.createElement('button');
  btnCancelar.type = 'button';
  btnCancelar.classList.add('btn_form', 'btn_cancelar');
  btnCancelar.textContent = 'Cancelar';

  btnCancelar.onclick = function () {
    regresarStage();
  };

  const btnGuardar = document.createElement('button');
  btnGuardar.type = 'submit';
  btnGuardar.classList.add('btn_form', 'btn_guardar');
  btnGuardar.textContent = 'Registrar';

  btnGuardar.onclick = function(){
    saveEmpleado();
  };
  
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "childList") {
        let contenedorBotones = document.querySelector('.button-group');
        if (contenedorBotones) {
          contenedorBotones.appendChild(btnCancelar);
          contenedorBotones.appendChild(btnGuardar);
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });  
}

// Función para regresar al stage
function regresarStage() {
  loadContent("empleados");
  const formulario = document.getElementById("empleadoForm");
  formulario.reset();
}

// Función para recolectar los datos del formulario y sanitizarlos
function obtenerDatosFormulario() {
  const formData = new FormData(document.getElementById("empleadoForm"));
  const sanitizedData = {};

  formData.forEach((value, key) => {
    sanitizedData[key] = sanitizarInput(value);
  });

  return sanitizedData;
}

// Función para guardar empleado
function saveEmpleado() {
  const form = $("#empleadoForm");
  let isValid = true;

  form.find(".error-message").remove();

  const dataEmpleado = {
    id: $("#idEmpleado").val(),
    name: $("#name").val().trim(),
    surname: $("#surname").val().trim(),
    dateOfBirth: $("#dateOfBirth").val(),
    email: $("#email").val().trim(),
    idRol: parseInt($("#idRol").val()),
  };  

  for (const [key, value] of Object.entries(dataEmpleado)) {
    if (key === "id") continue;

    if (!value) {
      const inputField = $(`#${key}`);
      inputField.after(
        `<small class="error-message text-danger">Este campo es obligatorio.</small>`
      );

      Swal.fire({
        title: "Oops",
        text: "Debes completar los campos obligatorios.",
        icon: "warning",
        confirmButtonColor: "#99212B",
      });

      isValid = false;
      break;
    }
  }

  if (!isValid) return;

  if(dataEmpleado.dateOfBirth.length > 0){
    const edad = calcularEdad(dataEmpleado.dateOfBirth);
    
    if (edad < 18 || edad > 65){    
      Swal.fire({
        title: "Oops",
        text: "No se pudo completar el registro del empleado ya que la edad no está dentro del rango permitido.",
        icon: "warning",
        confirmButtonColor: "#99212B",
      });
      isValid = false;
    }
  }else{
    Swal.fire({
      title: "Oops",
      text: "La fecha proporcionada no es válida.",
      icon: "warning",
      confirmButtonColor: "#99212B",
    });
    isValid = false;    
  }  

  if (!isValid) return;

  const email = validCorreo(dataEmpleado.email);

  if (!email) {
    Swal.fire({
      title: "Oops",
      text: "El correo del usuario no es correcto.",
      icon: "warning",
      confirmButtonColor: "#99212B",
    });
    return;
  }


  for (const key in dataEmpleado) {
    if (typeof dataEmpleado[key] === "string") {
      dataEmpleado[key] = sanitizarInput(dataEmpleado[key]);
    }
  }

  const method = dataEmpleado.id ? "PUT" : "POST";
  const url = dataEmpleado.id
    ? `http://localhost:3000/api/updateEmpleado`
    : `http://localhost:3000/api/newEmpleado`;

  $.ajax({
    url: url,
    method: method,
    contentType: "application/json",
    headers: {
      "x-token": localStorage.getItem("token"),
    },
    data: JSON.stringify(dataEmpleado),
    success: function (data) {             
      if (method === "POST") {
        if (data.ok === true) {
          Swal.fire({
            text: `El usuario ${dataEmpleado.email} fue registrado exitosamente.`,
            icon: "success",
            confirmButtonColor: "#0D3878",
          });
          const formulario = document.getElementById("empleadoForm");
          formulario.reset();
          loadContent("empleados");
        } else {
          Swal.fire({
            title: "Oops",
            text: `El usuario ${dataEmpleado.email} no fue posible registrarlo.`,
            icon: "warning",
            confirmButtonColor: "#99212B",
          });
        }
      } else {
        if (data.ok === true) {
          Swal.fire({
            text: `El usuario ${dataEmpleado.email} fue actualizado exitosamente.`,
            icon: "success",
            confirmButtonColor: "#0D3878",
          });
          loadContent("empleados");
        } else {
          Swal.fire({
            title: "Oops",
            text: `El usuario ${dataEmpleado.email} no fue posible actualizarlo.`,
            icon: "warning",
            confirmButtonColor: "#99212B",
          });
        }
      }
    },
    error: function (error) {
      console.error("Error saving employee:", error);
      alert("Error al guardar el empleado: " + error);
    },
  });
}

// Función para calcular la edad
function calcularEdad(fechaStr) {
  const fecha = new Date(fechaStr);
  const edadMs = Date.now() - fecha.getTime();
  const MsAnios = new Date(edadMs);
  return Math.abs(MsAnios.getUTCFullYear() - 1970);
}

// Función para validar email
function validCorreo(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Función de sanitización del form
function sanitizarInput(input) {
  return input.replace(/('|--|;|\/\*|\*\/|#)/g, "");
}

// Carga de los roles en el formulario
function rolesEmpleado(dataEmpleado = { idRol: '', rol: '' }) {  
  $.ajax({
    url: "http://localhost:3000/api/roles",
    method: "GET",
    headers: {
      "x-token": localStorage.getItem("token"),
    },
    success: function (data) {
      if (data.ok === true) {
        let html = "";
        data.resp.forEach(function (rol) {
          html += `            
          <option value="${rol.id}">${rol.rol}</option>            
          `;
        });
        $("#idRol").html(`<option value=${dataEmpleado.idRol}>${dataEmpleado.rol}</option>`);
        $("#idRol").append(html);
      } else {
        Swal.fire({
          title: "Oops",
          text: "No fue posible cargar los roles de los empleados.",
          icon: "warning",
          confirmButtonColor: "#99212B",
        });
        loadContent("empleados");
      }
    },
    error: function (error) {
      console.error("Error al cargalos roles:", error);
      alert("Error al cargalos roles: " + error);
    },
  });
}

// Carga de los roles en el formulario
function editarEmpleado(dataEmpleado) {
  loadContent("empleado");
  rolesEmpleado(dataEmpleado);  
 
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "childList") {
        
        let idCampo = document.getElementById('idEmpleado');
        let nameCampo = document.getElementById('name');
        let surnameCampo= document.getElementById('surname');
        let dateOfBirthCampo= document.getElementById('dateOfBirth');
        let emailCampo= document.getElementById('email');
        let contenedorBotones = document.querySelector('.button-group');        

        if (idCampo && nameCampo && surnameCampo && dateOfBirthCampo && emailCampo && contenedorBotones) {
          
          idCampo.value = dataEmpleado.id || '';
          nameCampo.value = dataEmpleado.name || '';
          surnameCampo.value = dataEmpleado.surname || '';
          emailCampo.value = dataEmpleado.email || '';

          if (dataEmpleado.DateOfBirth) {
            const date = new Date(dataEmpleado.DateOfBirth);
            dateOfBirthCampo.value = date.toISOString().split('T')[0]; // Formato adecuado
          } else {
            dateOfBirthCampo.value = '';
          }
          
          const btnCancelar = document.createElement('button');
          btnCancelar.type = 'button';
          btnCancelar.classList.add('btn_form', 'btn_cancelar');
          btnCancelar.textContent = 'Cancelar';
          btnCancelar.onclick = function () {
            regresarStage();
          };

          const btnGuardar = document.createElement('button');
          btnGuardar.type = 'submit';
          btnGuardar.classList.add('btn_form', 'btn_guardar');
          btnGuardar.textContent = 'Actualizar';
          btnGuardar.onclick = function(){
            saveEmpleado();
          };

          
          contenedorBotones.appendChild(btnCancelar);
          contenedorBotones.appendChild(btnGuardar);
          
          observer.disconnect();
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}


// Inicialización de la aplicación
$(document).ready(function () {
  const token = localStorage.getItem("token");

  if (token) {
    const currentPage = localStorage.getItem("currentPage") || "login";
    if (currentPage === "empleado") {
      loadContent("empleados");
    } else {
      loadContent(currentPage);
    }
  } else {
    localStorage.removeItem("currentPage");
    loadContent("login");
  }
  handleLogin();
});
