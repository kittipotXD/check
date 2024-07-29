document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('studentName', document.getElementById('studentName').value);
    formData.append('dutyDate', document.getElementById('dutyDate').value);
    formData.append('dutyPhoto', document.getElementById('dutyPhoto').files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('การยืนยันสำเร็จ!');
        } else {
            alert('มีข้อผิดพลาดในการยืนยัน');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    });
});
