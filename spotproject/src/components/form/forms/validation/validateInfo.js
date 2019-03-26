export default function(values) {
  const errors = {};
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'cwid',
    'birthdate',
    "citizen",
    "address",
    "city",
    "state",
    "zip"
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  return errors;
}
