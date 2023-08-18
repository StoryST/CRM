
const url = 'http://localhost:3000/api/clients';

export async function loadData() {
  try {
    const getClientsList = await fetch(url);
    return await getClientsList.json();

  } catch (error) {
    console.log(error);
  };
};

export function deleteObj(obj) {
  try {
   const response = fetch(`${url}/${obj.id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.log(error, error.message);
  };
};

export async function postObj(obj) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.status;
  } catch (error) {
    console.log(error, error.message);
  };
};

export async function patchObj(obj) {
  try {
    const response = await fetch(`${url}/${obj.id}`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.status
  } catch (error) {
    console.log(error, error.message);
  };
};

export async function searchClient(value) {
  try {
    const response = await fetch(`${url}?search=${value}`, {
      method: 'GET',
    });
    return response.json();

  } catch (error) {
    console.log(error);
  };
};

export async function getClient(id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  };
};

