const Scheme = require('./scheme-model')
const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await Scheme.checkID(req.params.scheme_id)
    if (scheme) {
      req.scheme = scheme
      next()
    }
    else {
      next({ status: 404, message: `scheme with scheme_id ${req.params.scheme_id} not found` })
    }
  }
  catch (err) {
    next(err)
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  try {
    const { scheme_name } = req.body
    if (typeof scheme_name !== 'string'
      || scheme_name === undefined
      || !scheme_name.trim()) {
      next({ status: 400, message: 'invalid scheme_name' })
    }
    else {
      next()
    }
  }
  catch (error) {
    next(error)
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  try {
    const { step_number, instructions } = req.body
    if (NaN(step_number) || step_number < 1
    ||!instructions.trim()||typeof instructions !=='string') {
      next({ status: 400, message: 'invalid step' })
    }
    else {
      next()
    }
  }
  catch (error) {
    next(error)
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
