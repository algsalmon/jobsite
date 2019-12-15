$(document).ready(function() {
	$("#signup-form").submit(function(e){
		e.preventDefault(); 
		
		var $form = $(this),
		name = $form.find('input[name="name"]').val(),
		email = $form.find('input[name="email"]').val(),
		lastName = $form.find('input[name="lastName"]').val(),
		address1 = $form.find('input[name="address1"]').val(),
		address2= $form.find('input[name="address2"]').val(),
		city = $form.find('input[name="city"]').val(),
		postCode = $form.find('input[name="postCode"]').val(),
		phone = $form.find('input[name="phone"]').val(),
		tickYes = $form.find('input[name="tickYes"]').val(),
		tickYes1 = $form.find('input[name="tickYes1"]').val(),
		day = $form.find('input[name="dob_day"]').val(),
		month = $form.find('input[name="dob_month"]').val(),
		year = $form.find('input[name="dob_year"]').val(),
		DOB = year+''+month+''+day,
		url = $form.attr('action');
		console.log(DOB);

	
		
		$.post(url, {name:name, email:email,lastName:lastName, address1:address1, address2:address2, city:city, postCode:postCode, phone:phone, tickYes:tickYes, tickYes1:tickYes1},
		  function(data) {
		      if(data)
		      {
		      	if(data=="Some fields are missing.")
		      	{
			      	$("#status").text("Please fill in your name and email.");
			      	$("#status").css("color", "red");
		      	}
		      	else if(data=="Invalid email address.")
		      	{
			      	$("#status").text("Your email address is invalid.");
			      	$("#status").css("color", "red");
		      	}
		      	else if(data=="Invalid list ID.")
		      	{
			      	$("#status").text("Your list ID is invalid.");
			      	$("#status").css("color", "red");
		      	}
		      	else if(data=="Already subscribed.")
		      	{
			      	$("#status").text("You're already subscribed!");
			      	$("#status").css("color", "red");
		      	}
		      	else
		      	{
			      	$("#status").text("You're subscribed!");
			      	$("#status").css("color", "green");
		      	}
		      }
		      else
		      {
		      	//alert("Sorry, unable to subscribe. Please try again later!");
		      }
		  }
		);
	});
	$("#signup-form").keypress(function(e) {
		    if(e.keyCode == 13) {
		    	e.preventDefault(); 
				$(this).submit();
		    }
		});
	$("#submit-btn").click(function(e){
		e.preventDefault(); 
		$("#signup-form").submit();
	});
});