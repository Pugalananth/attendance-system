import { authAPI } from './api';

export const loginUser = async (

  email,

  password

) => {

  try {

    const response =
      await authAPI.login(

        email,

        password

      );

    return response.data;

  } catch (error) {

    console.log(

      'LOGIN ERROR:',

      error

    );

    throw error;
  }
};

export const setupAdmin =
  async () => {

  try {

    const response =
      await authAPI.setupAdmin();

    return response.data;

  } catch (error) {

    console.log(

      'SETUP ADMIN ERROR:',

      error

    );

    throw error;
  }
};