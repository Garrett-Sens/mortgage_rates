console.log( 'client side js file loaded' );

const weatherForm = document.querySelector( 'form' );
const search = document.querySelector( 'input' );
const messageOne = document.querySelector( '#message-1' );
const messageTwo = document.querySelector( '#message-2' );

weatherForm.addEventListener( 'submit', function( ev )
{
	ev.preventDefault();

	const location = search.value;

	fetch( 'http://localhost:3000/weather?address=' + location ).then(
		function( response )
		{
			response.json().then(
				function( data )
				{
					if( data.error )
					{
						messageOne.textContent = data.error;
					}
					else
					{
						messageOne.textContent = data.location;
						messageTwo.textContent = data.forecast;
					}
				}
			);
		}
	);
});