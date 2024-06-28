document.getElementById('fileUpload').addEventListener('change', function() {
    const fileName = this.files[0].name;
    document.getElementById('browseFiles').textContent = fileName;
});

const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');
    const files = event.dataTransfer.files;
    document.getElementById('fileUpload').files = files;
    document.getElementById('browseFiles').textContent = files[0].name;
});

document.querySelector('.form-container').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission to validate first
    const category = document.getElementById('category').value;
    const model = document.getElementById('model').value;
    const serialNumber = document.getElementById('serialNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const fileUpload = document.getElementById('fileUpload').files[0];

    let isValid = true;
    let errorMessage = '';

    if (!category) {
        isValid = false;
        errorMessage += 'Please select a category.\n';
    }

    if (!model) {
        isValid = false;
        errorMessage += 'Please select a model.\n';
    }

    if (!serialNumber) {
        isValid = false;
        errorMessage += 'Please enter the serial number.\n';
    }

    if (!invoiceDate) {
        isValid = false;
        errorMessage += 'Please enter the invoice date.\n';
    }

    if (!fileUpload) {
        isValid = false;
        errorMessage += 'Please upload a file.\n';
    }

    if (isValid) {
        // Submit the form data using fetch API to Node.js backend
        const formData = new FormData();
        formData.append('category', category);
        formData.append('model', model);
        formData.append('serialNumber', serialNumber);
        formData.append('invoiceDate', invoiceDate);
        formData.append('fileUpload', fileUpload);

        fetch('http://localhost:3000/register-product', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Show success message in UI
            alert(data.message); // You can replace alert with any UI update method

            // Clear form inputs
            document.getElementById('category').value = '';
            document.getElementById('model').value = '';
            document.getElementById('serialNumber').value = '';
            document.getElementById('invoiceDate').value = '';
            document.getElementById('fileUpload').value = ''; // Reset file input
            document.getElementById('browseFiles').textContent = 'Drag files here or browse'; // Reset file label
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert(errorMessage); // Show error messages
    }
});
