function toggleLoader(){
  let loader = document.getElementById("loader");
  let cL = loader.classList;
  if (cL.contains("d-none")) {
    cL.remove("d-none");
  } else {
    cL.add("d-none");
  }
};

$('#matrixForm').on('submit', (e)=>{
  e.preventDefault();
  toggleLoader();

  let formData = new FormData();
  let indexFile = document.querySelector("#indexFile").files[0];
  let matrixFile = document.querySelector("#indexFile").files[0];
  formData.append("index", indexFile);
  formData.append("matrix", matrixFile);

  axios({
    method: "POST",
    url: "./api/create-matrix",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });

  toggleLoader();
});
