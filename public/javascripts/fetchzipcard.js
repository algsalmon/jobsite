
    searchJob = (query) => {
    const jobsSearchUrl = `https://api.ziprecruiter.com/jobs/v1?search=${query}%20Jobs&location=,%20UK&radius_miles=25&days_ago=&jobs_per_page=1&page=&api_key=mprhzcufvfyqvnuqezdqrryira9eusdu&geo=&distance=15&salarytype=annum&tempperm=Any&posted=14&order=date`;
    fetch(jobsSearchUrl)
      .then(response => response.json())
      .then((jobs) => {
        console.log(jobs);
 
        // pageSelect.innerHTML = pageOptions;
        paginationButtons.innerHTML = buttonsHTML;
        //paginationButtonsBottom.innerHTML = buttonsHTML;

        var jobDescriptions = "";
        jobs.jobs.forEach((result) => {
          console.log("result:" + result)
          jobDescriptions = jobDescriptions + `
            <div class="container">
              <div class="row">
                <div class="col-sm-4">
                
                 <h5>${result.hiring_company.name}</h5> 
                </div>
                <div class="col-sm-4">
             
                </div>
                <div class="col-sm-4"></div>
              </div>  
              <div class="row">
                <div class="col-sm-12">
                  <p>${result.snippet}</p> 
                </div>     
                <div class="col-sm-3">
                  <p>
                    <button>
                      <a href= ${result.url}> Apply Here </a> 
                    </button>
                  </p>                 
                </div>  
              </div>       
            </div>            
          `;
        });
        jobba.innerHTML = jobDescriptions;
      });
    // });
  };


  //  load page initial data
  searchJob("customer assistant");


  //Search form and Function
  const jobsForm = document.querySelector("#searchJob");
  jobsForm.addEventListener('submit', (event) => {
    currentPage = 1;
    event.preventDefault();
    const input = event.currentTarget.querySelector('.form-control');
    //input.value="";
    jobba.innerHTML = '';
    console.log("search:" + input.value);
    //const value = input.value;
    searchJob(input.value);
  });

 



