const fetchJobs = (query) => { fetch("https://www.cv-library.co.uk/search-jobs-json?key=ZLv,7aJ4PLzcsYKk&q=sales&geo=london&distance=15&salarytype=annum&tempperm=Any")
.then(response => response.json())
.then(jobs);
};
console.log(jobs)
export { fetchJobs };