var searchJob;
var currentPage = 1;
window.onload = function () {
  const jobba = document.querySelector("#jobNews")
  var itemsPerPage = 25;
  
  // const pageSelect = document.querySelector("#pageSelection");
  const paginationButtons = document.querySelector("#paginationButtons");
  //const paginationButtonsBottom = document.querySelector("#paginationButtonsBottom");
  searchJob = (query,jobLocation) => {
    //   currentPage = pageSelect.options[pageSelect.selectedIndex].value;
    if (!jobLocation){
      jobLocation = "";
    }
    
    const jobsSearchUrl = `https://api.ziprecruiter.com/jobs/v1?search=${query}%20Jobs&location=${jobLocation}%20UK&radius_miles=25&days_ago=&jobs_per_page=10&page=${currentPage}&api_key=mprhzcufvfyqvnuqezdqrryira9eusdu&geo=&distance=15&salarytype=annum&tempperm=Any&posted=14&order=date`;
    fetch(jobsSearchUrl)
      .then(response => response.json())
      .then((jobs) => {
        console.log(jobs);
        // jobs.forEach((result) => {
        //   // jobs.push({
        //   //       date: result.posted_time,
        //   //       title: result.hiring_company.name,
        //   //       location: result.location,
        //   //       description: result.hiring_company.description,
        //   //       url: result.url
        //   //     });
        //   //   });

        var totalResultsSpan = document.querySelector("#totalResults");
        totalResultsSpan.innerHTML = "Found " + jobs.total_jobs + " " + query + " jobs";
       
        var totalEntries = jobs.total_entries;
        var pageCount = totalEntries / itemsPerPage;
        var pageOptions = "";
        var buttonsHTML = "";
        for (var i = currentPage - 5; i < currentPage + 5; i++) {
          var j = i;
          // initilaisation code, codition, add one increment
          if (currentPage < 5) {
            j = j + (5 - currentPage);
          }
          if (currentPage == (j + 1)) {
            buttonsHTML = buttonsHTML + "<button style='background-color:red'>" + (j + 1) + "</button>";
            pageOptions = pageOptions + "<option selected>" + (j + 1) + "</option>";
          } else {
            buttonsHTML = buttonsHTML + "<button onclick='currentPage=" + (j + 1) + ";searchJob(\"" + query + "\")' >" + (j + 1) + "</button>";
            pageOptions = pageOptions + "<option>" + (j + 1) + "</option>";
          }
        }
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
                
                <a href=${result.url}>  <h5 id="jobheader">${result.hiring_company.name}</h5> </a> 
                </div>
                <div class="col-sm-4">
             
                </div>
                <div class="col-sm-4"><h3>${result.name}</h3></div>
              </div>  
              <div class="row">
                <div class="col-sm-12" id="snippet">
                  <p>${result.snippet}</p> 
                </div>     
                <div class="col-sm-3">
                <p>${result.location}</p> 
                  
                </div>  
                <div class="col-sm-3">
                <p>£${result.salary_min}</p>               
                </div>
                <div class="col-sm-6">
                <p><a href="https://newskillsacademy.co.uk/?ref=274"> Take A  ${result.category} Skills Course</a><br> 50% Discount Code: GRABBA </p> 
                  
                </div>    
              </div>       
            </div>  
                                   
            <br>          
          `;
        });
        jobba.innerHTML = jobDescriptions;
      });
    // });
  };

   
  //  load page initial data
console.log(jobCategory)
  searchJob(jobCategory,jobLocation);


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

  /* pageSelect.addEventListener('change', (event) => {
    const input = document.querySelector('#searchField');
    //input.value="";
    jobba.innerHTML = '';
    console.log("search:" + input.value);
    //const value = input.value;
    searchJob(input.value);

  });*/


  //   End search form and function
  console.log("external file")
}



