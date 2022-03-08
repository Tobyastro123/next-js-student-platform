// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { Animal, createAnimal, getAnimals } from '../../../util/database';

type AnimalsRequestBody = { animal: Omit<Animal, 'id'> };

type AnimalsNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: AnimalsRequestBody;
};

export type AnimalsResponseBodyGet = {
  animals: Animal[];
};

export type AnimalsResponseBodyPost = { error: string } | { animal: Animal };

type AnimalsResponseBody = AnimalsResponseBodyGet | AnimalsResponseBodyPost;

export default async function handler(
  request: AnimalsNextApiRequest,
  response: NextApiResponse<AnimalsResponseBody>,
) {
  console.log('request Method', request.method);
  console.log('request Body', request.body);

  // access the method from the request object
  if (request.method === 'GET') {
    // if the method is get response with an array of animals

    const animals = await getAnimals();

    response.status(200).json({ animals: animals });
    return;
  } else if (request.method === 'POST') {
    // if the post create a new animal and response the new created animal

    // access the body animal from the request object
    const animalFromRequest = request.body.animal;

    // TODO: create error responses when the body don't have the full data. with a 400 status code

    const newAnimal = await createAnimal(
      animalFromRequest.firstName,
      animalFromRequest.age,
      animalFromRequest.type,
      animalFromRequest.accessory,
    );

    response.status(200).json({ animal: newAnimal });
    return;
  }

  response.status(405).json({ error: 'Method not Allowed' });

  // if any other method response method not allowed
}
