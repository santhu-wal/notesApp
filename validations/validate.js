const joi = require("joi");

const register = joi.object({
  username: joi.string().alphanum().min(3).max(25).trim(true).required(),
  emailId: joi.string().email().trim(true).required(),
  password: joi.string().min(5).trim(true).required(),
  // role:joi.string().required()
});

exports.userValidate = async (req, res, next) => {
  const data = {
    username: req.body.username,
    emailId: req.body.emailId,
    password: req.body.password,
  };

  const { error } = register.validate(data);
  if (error) {
    return res.status(400).send({ err: error.message });
  } else {
    next();
  }
};


const login = joi.object({
  emailId: joi.string().email().required(),
  password: joi.string().required(),
});


exports.loginValidate = async (req, res, next) => {
  const data = {
    emailId: req.body.emailId,
    password: req.body.password,
  };

  const { error } = login.validate(data);
  if (error) {
    return res.status(400).send({ err: error.message });
  } else {
    next();
  }
};





const pwd = joi.object({
  password: joi.string().required(),
  newpassword: joi.string().min(5).trim(true).required()
});


exports.passwordValidate = async (req, res, next) => {
  const data = {
    password: req.body.password,
    newpassword: req.body.newpassword
  };

  const { error } = pwd.validate(data);
  if (error) {
    return res.status(400).send({ err: error.message });
  } else {
    next();
  }
};



const notesVal = joi.object({
  title: joi.string().trim(true).required(),
  note: joi.string().trim(true).required()
});


exports.noteValidate = async (req, res, next) => {
  const data = {
    title: req.body.title,
    note: req.body.note
  };

  const { error } = notesVal.validate(data);
  if (error) {
    return res.status(400).send({ err: error.message });
  } else {
    next();
  }
};



const commentVal = joi.object({
  comment: joi.string().required(),
});


exports.commentValidate = async (req, res, next) => {
  const data = {
    comment: req.body.comment
  };

  const { error } = commentVal.validate(data);
  if (error) {
    return res.status(400).send({ err: error.message });
  } else {
    next();
  }
};







const dateVal = joi.object({
  from_date: joi.date().required(),
  to_date: joi.date().required()
});


exports.dateValidate = async (req, res, next) => {
  const data = {
    from_date: req.body.from_date,
    to_date: req.body.to_date
  }


const { error } = dateVal.validate(data);
if (error) {
  return res.status(400).send({ err: error.message });
} else {
  next();
}

}




