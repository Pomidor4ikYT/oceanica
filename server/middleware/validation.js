// server/middleware/validation.js
function validateRegistration(req, res, next) {
  const { name, email, password } = req.body;
  
  if (!name || name.length < 2) {
    return res.status(400).json({ 
      success: false, 
      message: 'Ім\'я повинно містити хоча б 2 символи' 
    });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Введіть коректний email' 
    });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Пароль повинен містити хоча б 6 символів' 
    });
  }
  
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Введіть email та пароль' 
    });
  }
  
  next();
}

module.exports = {
  validateRegistration,
  validateLogin
};