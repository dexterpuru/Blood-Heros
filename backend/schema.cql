CREATE TABLE doctor (
  id     uuid,
  username  text,
  doctorid   text,
  name      text,
  hospital text,
  medcouncil text,
  email text,
  created_date timestamp,
  PRIMARY KEY(id)
);

CREATE TABLE doctor_credentials (
  id     uuid,
  username  text,
  password text,
  PRIMARY KEY(username)
);