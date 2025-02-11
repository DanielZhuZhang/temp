let storedUsername;
let storedPassword;
let loggedIn;
let idArray = [];

const submit = async function (event) {
    event.preventDefault();

    const inputName = document.querySelector("#yourname").value;
    const inputAge = document.querySelector("#yourage").value;
    const inputMajor = document.querySelector("#yourmajor").value;

    if (isNaN(inputAge) || inputAge.trim() === "") {
        alert("Please enter a valid number for age.");
        return; // Exit the function
    }

    const jsonData = {
        UserName: storedUsername,
        PassWord: storedPassword,
        Name: inputName,
        Age: inputAge,
        Major: inputMajor
    };

    const body = JSON.stringify(jsonData);
    console.log(body);

    const responsePost = await fetch("/submit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    });

    const textResponse = await responsePost.text();
    console.log("text:", textResponse);

    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });

    const text = await response.text();
    const convertedServerResults = JSON.parse(text);
    console.log("Results:", convertedServerResults);
    console.log("Results (raw):", text);

    let table = document.getElementById("resultstoUpdate");

    table.innerHTML =
        `<tr>
        <th>Name</th>
        <th>Age</th>
        <th>Major</th>
        <th>EstimatedBirthYear</th>
    </tr>`;

    const resultsArray = Array.isArray(convertedServerResults)
        ? convertedServerResults
        : [convertedServerResults];

    resultsArray.forEach(item => {
        let row = document.createElement("tr");

        row.innerHTML = `<td><input type="text" id="name" value="${item.Name}"></td>
        <td><input type="text" id="Age" value="${item.Age}"></td>
        <td><input type="text" id="Major" value="${item.Major}"></td>
        <td>${item.estimatedBirthYear}</td>`;
        table.appendChild(row);
    });
};


window.onload = function () {
    storedUsername = localStorage.getItem('username');
    storedPassword = localStorage.getItem('password');
    const profileNameField = document.querySelector('#profileName');
    if (storedUsername) {
        profileNameField.textContent = storedUsername;
        loggedIn = true;
    } else {
        profileNameField.textContent = 'Guest';
        loggedIn = false;
    }

    showSection("SubmitFormAll");

    const submitButton = document.querySelector("#submitbutton");
    const updateButton = document.querySelector("#updatebutton");
    const deleteButton = document.querySelector("#deleteButton");
    const deletePage = document.querySelector("#deletepage");
    const updatePage = document.querySelector("#updatepage");
    const submitPage = document.querySelector("#submitpage");
    const signoutPage = document.querySelector("#SignOutButton");

    if (loggedIn) {
        submitButton.onclick = submit;
        updateButton.onclick = update;
        deleteButton.onclick = deleteFormElement;
        submitPage.onclick = updatetoSubmitPage;
        updatePage.onclick = updatetoUpdatePage;
        deletePage.onclick = updatetoDeletePage;
        signoutPage.onclick = returntoLoginPage;
    } else {
        signoutPage.onclick = returntoLoginPage;
        console.log("Not Logged In");
    }

}
const returntoLoginPage = async function (event) {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = '/index.html';
}

const deleteFormElement = async function (event) {
    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });
    const text = await response.text();
    let updatedData = JSON.parse(text);

    const idToRemove = idArray[document.querySelector("#deleteID").value - 1];
    console.log("idToRemove:", idToRemove);

    updatedData = updatedData.filter((item) => item._id.toString() !== idToRemove);
    console.log(updatedData);
    await fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    display();
}

const EditMode = async function (event) {
    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });

    const text = await response.text();
    const convertedServerResults = JSON.parse(text);
    let EditableTable = document.getElementById("resultstoUpdate");


    EditableTable.innerHTML =
        `<tr>
        <th>Name</th>
        <th>Age</th>
        <th>Major</th>
        <th>Estimated Birth Year</th>
    </tr>`;

    convertedServerResults.forEach(item => {
        let row = document.createElement("tr");

        row.innerHTML = `<td>${item.Name}</td>
                     <td>${item.Age}</td>
                     <td>${item.Major}</td>
                     <td>${item.estimatedBirthYear}</td>`;

        EditableTable.appendChild(row);
    });
}

function showSection(sectionToShow) {
    const sections = ["SubmitFormAll", "UpdateFormAll", "DeleteFormAll"];
    console.log("Switching to section:", sectionToShow);

    sections.forEach(section => {
        const element = document.getElementById(section);

        if (section === sectionToShow) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    });
}


const updatetoSubmitPage = async function (event) {
    const header = document.querySelector("#header h2");
    header.textContent = "Submit Form";
    showSection("SubmitFormAll");
}


const updatetoUpdatePage = async function (event) {
    const header = document.querySelector("#header h2");
    header.textContent = "Update Form";
    showUpdate();
    showSection("UpdateFormAll");
}

const updatetoDeletePage = async function (event) {
    const header = document.querySelector("#header h2");
    header.textContent = "Delete Form";
    display();
    showSection("DeleteFormAll");
}

const update = async function (event) {
    let convertedServerResults = []
    let table = document.getElementById("resultstoDelete");
    let rows = table.getElementsByTagName("tr");
    let updatedData = [];

    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");

        let name = cells[1].querySelector("input").value;
        let Age = cells[2].querySelector("input").value;
        let Major = cells[3].querySelector("input").value;
        let currentYear = new Date().getFullYear();
        let estimatedBirthYear = currentYear - Age;

        updatedData.push({UserName: storedUsername, PassWord: storedPassword,"Name": name, "Age": Age, "Major": Major, "estimatedBirthYear": estimatedBirthYear });
    }
    console.log("Updated data:", updatedData);

    await fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });


    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });
    const text = await response.text();
    convertedServerResults = JSON.parse(text);
    console.log("Results:", convertedServerResults);
    let updatedtable = document.getElementById("resultstoDelete");


    updatedtable.innerHTML =
        `<tr>
        <th>Name</th>
        <th>Age</th>
        <th>Major</th>
        <th>EstimatedBirthYear</th>
    </tr>`;

    convertedServerResults.forEach(item => {
        let row = document.createElement("tr");

        row.innerHTML = `<td><input type="text" id="name" value="${item.Name}"></td>
        <td><input type="text" id="Age" value="${item.Age}"></td>
        <td><input type="text" id="Age" value="${item.Age}"></td>
        <td><input type="text" id="Major" value="${item.Major}"></td>
        <td>${item.estimatedBirthYear}</td>`;
        table.appendChild(row);
    })
}

const showUpdate = async function (event) {
    let convertedServerResults = []
    let table = document.getElementById("resultstoDelete");

    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });
    const text = await response.text();
    convertedServerResults = JSON.parse(text);
    if (convertedServerResults.length === 0) {
        alert("Nothing to update");
        return;
    }
    console.log("Results:", convertedServerResults);
    let updatedtable = document.getElementById("resultstoDelete");


    updatedtable.innerHTML =
        `<tr>
        <th>Name</th>
        <th>Age</th>
        <th>Major</th>
        <th>EstimatedBirthYear</th>
    </tr>`;

    convertedServerResults.forEach(item => {
        let row = document.createElement("tr");

        row.innerHTML = `<td><input type="text" id="name" value="${item.Name}"></td>
        <td><input type="text" id="Age" value="${item.Age}"></td>
        <td><input type="text" id="Age" value="${item.Age}"></td>
        <td><input type="text" id="Major" value="${item.Major}"></td>
        <td>${item.estimatedBirthYear}</td>`;
        table.appendChild(row);
    })
}
const display = async function (event) {

    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: storedUsername,
            password: storedPassword
        })
    });

    const text = await response.text();
    const convertedServerResults = JSON.parse(text);
    let updatedtable = document.getElementById("resultstoDelete");


    updatedtable.innerHTML =
        `<tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Major</th>
        <th>Estimated Birth Year</th>
    </tr>`;
    idArray = [];
    convertedServerResults.forEach((item, index) => {
        idArray.push(item._id);
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td> <!-- Display the index (1-based) -->
            <td>${item.Name}</td>
            <td>${item.Age}</td>
            <td>${item.Major}</td>
            <td>${item.estimatedBirthYear}</td>
        `;

        updatedtable.appendChild(row);
    });


    console.log("ID Array:", idArray);
};

