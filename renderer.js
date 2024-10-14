document
  .getElementById('authorForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const authorData = {
      author_name: document.getElementById('author_name').value,
      affiliation: document.getElementById('affiliation').value,
      email: document.getElementById('email').value,
      author_role: document.getElementById('author_role').value,
      type: document.getElementById('type').value,
      position: document.getElementById('position').value,
    };

    try {
      const response = await fetch('http://127.0.0.1:3000/api/v1/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      const data = await response.json();
      console.log(data);

      console.log('Preload script is running');
      console.log('Electron context is exposed:', window.electron);

      if (data.status === 'success') {
        console.log('Author created successfully:', data.data.author);
        // Gửi thông tin đến main process để in
        window.electron.send('print-author', data.data.author); // Kiểm tra xem window.electron có được định nghĩa không
      } else {
        console.error('Failed to create author:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
