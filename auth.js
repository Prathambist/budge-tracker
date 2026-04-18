function auth(){
    const mail= document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passRegex=/(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{8,20}$/;

    if(!mail){
        alert("email cannot be empty");
        return false;
    }else if(!emailRegex.test(mail)){
        alert("invalid email");
    }


    if(!pass){
        alert("password cannot be empty");
        return false;
    }else if(!passRegex.test(pass)){
        alert("invalid password");
        return false;
    }


     if(emailRegex.test(mail) && passRegex.test(pass)){
        alert("login successful");
     }

     return false;
    }
   