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
            
            const dataDisplay = document.getElementById('dataDisplay');
            dataDisplay.innerHTML = `
                <p>ชื่อนักเรียน: ${data.data.studentName}</p>
                <p>วันที่ทำเวร: ${data.data.dutyDate}</p>
                <p>รูปภาพ: <a href="${data.data.dutyPhoto}" target="_blank">ดูรูปภาพที่นี่</a></p>
            `;
        } else {
            alert('มีข้อผิดพลาดในการยืนยัน');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('มีข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    });
});
