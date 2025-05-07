async function cargarPersonas() {

    const response = await fetch("/api/personas");
    const personas = await response.json();
    const lista = document.getElementById("personas");

    lista.innerHTML= "";
    personas.forEach(persona => {
        const item= document.createElement("li");
        item.textContent = `${persona.nombre} (${persona.edad} años)`; 
        lista.appendChild(item);
    });
    document.getElementById("personaForm").addEventListener("submit",async (event)=>{
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = new URLSearchParams(FormData);

        await fetch ("/apt/personas",{
            method: "POST",
            body: data
        });
        cargarPersonas();
        event.target.removeEventListener();
    });
}
cargarPersonas();