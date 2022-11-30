export const userPayLoad = {
  data: {
    accountName: 'test2',
    email: 'test2@google.com',
    password: 'test123',
  },
}

export const sameAccNameUserPayLoad = {
  data: {
    accountName: 'test2',
    email: 'test3@google.com',
    password: 'test123',
  },
}

export const shortPasswordLengthUserPayLoad = {
  data: {
    accountName: 'test4',
    email: 'test4@example.com',
    password: 'text',
  },
}
export const longPasswordLengthUserPayLoad = {
  data: {
    accountName: 'test4',
    email: 'test4@example.com',
    password: 'textfewajoi3248943fwe1231',
  },
}

export const userLoginPayLoad = {
  data: {
    email: 'test2@google.com',
    password: 'test123',
  },
}

export const invalidEmailLoginPayload = {
  data: {
    email: 'test22@google.com',
    password: 'test123',
  },
}

export const invalidPasswordLoginPayload = {
  data: {
    email: 'test2@google.com',
    password: 'test1234',
  },
}
