const events = new EventSource('http://localhost:8000/api/chat/connect');
// events.onmessage = (event) => {
//     const parsedData = JSON.parse(event.data);
//     console.log(parsedData);
// }