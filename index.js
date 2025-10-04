document.addEventListener("DOMContentLoaded", () => {
  const repairForm = document.getElementById("repair-form");
  const studentFormSection = document.getElementById("student-form-section");
  const studentEmailRow = document.getElementById("student-email-row");
  const modeStudentBtn = document.getElementById("mode-student");
  const modeTeacherBtn = document.getElementById("mode-teacher");
  const contactInput = document.getElementById("contact");

  // 學生表單欄位
  const studentFields = ['name', 'id', 'grade', 'class'];

  let currentMode = 'student'; // 預設為學生模式

  // 設定按鈕樣式和表單顯示
  const setFormMode = (mode) => {
  currentMode = mode;
  if (mode === 'student') {
    modeStudentBtn.classList.add('bg-school', 'text-white', 'shadow');
    modeStudentBtn.classList.remove('text-gray-700', 'hover:text-school');
    modeTeacherBtn.classList.remove('bg-school', 'text-white', 'shadow');
    modeTeacherBtn.classList.add('text-gray-700', 'hover:text-school');
    studentFormSection.classList.remove('hidden');
    studentFields.forEach(field => {
      document.getElementById(field).setAttribute('required', 'true');
    });
    // 顯示學生Email欄位並設為必填
    studentEmailRow.style.display = "";
    contactInput.setAttribute('required', 'true');
  } else { // teacher mode
    modeTeacherBtn.classList.add('bg-school', 'text-white', 'shadow');
    modeTeacherBtn.classList.remove('text-gray-700', 'hover:text-school');
    modeStudentBtn.classList.remove('bg-school', 'text-white', 'shadow');
    modeStudentBtn.classList.add('text-gray-700', 'hover:text-school');
    studentFormSection.classList.add('hidden');
    studentFields.forEach(field => {
      document.getElementById(field).removeAttribute('required');
    });
    // 隱藏學生Email欄位並移除必填
    studentEmailRow.style.display = "none";
    contactInput.removeAttribute('required');
    contactInput.value = ""; // 清空欄位
  }
  };


  // 初始化表單模式
  setFormMode('student');

  modeStudentBtn.addEventListener('click', () => setFormMode('student'));
  modeTeacherBtn.addEventListener('click', () => setFormMode('teacher'));

  repairForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      building: document.getElementById("building").value,
      location: document.getElementById("location").value,
      itemType: document.getElementById("itemType").value,
      description: document.getElementById("description").value,
      teacherName: document.getElementById("teacherName").value,
      teacherEmail: document.getElementById("teacherEmail").value,
      contact: document.getElementById("contact").value,
    };

    // 只有在學生模式下才包含學生資訊
    if (currentMode === 'student') {
      formData.name = document.getElementById("name").value;
      formData.id = document.getElementById("id").value;
      formData.grade = document.getElementById("grade").value;
      formData.class = document.getElementById("class").value;
      
      // 學生模式下需要驗證學生資訊
      if (!formData.name || !formData.id || !formData.grade || !formData.class || !formData.contact) {
        alert("請填寫所有學生及聯絡資訊的必填欄位！");
        return;
      }
    } else {
        // 老師模式下，將學生相關欄位設置為空字串或預設值，確保後端接收到的資料格式一致
        formData.name = "老師報修"; 
        formData.id = "N/A";
        formData.grade = "N/A";
        formData.class = "N/A";
        formData.contact = "N/A";
        if (formData.contact === '') {
            formData.contact = 'N/A';
        }
    }

    // 檢查報修內容必填欄位
    if (!formData.building || !formData.location || !formData.itemType || !formData.description || !formData.teacherName || !formData.teacherEmail) {
        alert("請填寫所有報修內容及老師聯絡資訊的必填欄位！");
        return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3000/submit_repair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("報修單提交成功！您的報修單號是：" + result.repair_id + "。請妥善保存以供查詢。");
        repairForm.reset(); // 清空表單
        // 重設為學生模式
        setFormMode('student'); 
      } else {
        alert("提交失敗：" + result.message);
      }
    } catch (error) {
      console.error("提交報修請求失敗：", error);
      alert("無法連接到伺服器，請檢查網路或伺服器狀態。");
    }
  });
});