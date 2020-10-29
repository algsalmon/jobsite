var serchJob;
var currentPage = 1;
window.onload  = function ( )  {
  const jobba = document.querySelector("#jobNews")
  var itemsPerPage = 25;
  // const pageSelect = document.querySelector("#pageSelection");
  const paginationButtons = document.querySelector("#paginationButtons");
  //const paginationButtonsBottom = document.querySelector("#paginationButtonsBottom");
  searchJob = (query) => {
 //   currentPage = pageSelect.options[pageSelect.selectedIndex].value;

    const jobsSearchUrl = `https://www.cv-library.co.uk/search-jobs-json?key=ZLv,7aJ4PLzcsYKk&q=${query}&perPage=25&offset=`+(25*currentPage)+`&geo=&distance=15&salarytype=annum&tempperm=Any&posted=14&order=date`;
    fetch(jobsSearchUrl)
      .then(response => response.json())
      .then((jobs) => {
        console.log(jobs);

        var totalResultsSpan = document.querySelector("#totalResults");
        totalResultsSpan.innerHTML = "Found "+jobs.total_entries+" "+query+" jobs";

        var totalEntries = jobs.total_entries;
        var pageCount = totalEntries/itemsPerPage;
        var pageOptions = "";
        var buttonsHTML = "";
        for (var i = currentPage-5; i < currentPage + 5; i++) {
          var j = i;
          // initilaisation code, codition, add one increment
          if(currentPage < 5){
            j = j + (5-currentPage);
          }
          if (currentPage == (j+1)) { 
            buttonsHTML = buttonsHTML+"<button style='background-color:red'>"+(j+1)+"</button>";
            pageOptions = pageOptions+"<option selected>"+(j+1)+"</option>";
          } else {
            buttonsHTML = buttonsHTML+"<button onclick='currentPage="+(j+1)+";searchJob(\""+query+"\")' >"+(j+1)+"</button>";
            pageOptions = pageOptions+"<option>"+(j+1)+"</option>";
          }
        }
        // pageSelect.innerHTML = pageOptions;
        paginationButtons.innerHTML = buttonsHTML;
        //paginationButtonsBottom.innerHTML = buttonsHTML;

        var jobDescriptions = "";
        jobs.jobs.forEach((result) => {
          console.log("result:" + result);
          jobDescriptions = jobDescriptions + `
            <div class="container">
            <div class="row"></div>
            <div class="col-sm-12" id="Jobtit"><a href= https://www.cv-library.co.uk${result.url}> ${result.title}
            </a> </div>
              <div class="row">
                <div class="col-sm-6">
                <p><b>${result.agency.title}</b></p>  
                </div>
             
                <div class="col-sm-6">${result.location}</div>
                
               
              </div>  
              <div class="row">
                <div class="col-sm-12">
                  <p>${result.description.trim()}</p> 
                </div>     
                <div class="col-sm-3">
                  <p>
                    
                  </p>                 
                </div>  
              </div>       
            </div>            
          `;
        });
        jobba.innerHTML = jobDescriptions;

      });
    };


    //  load page initial data
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
        


      