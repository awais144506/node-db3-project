const db = require('../../data/db-config')


function find() { // EXERCISE A
  const result = db('schemes as sc')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'asc')

  return result
}
//Additional Function 
async function checkID(id) {
  const result = await db('schemes').where('scheme_id', id).first()
  return result
}
//End
async function findById(scheme_id) { // EXERCISE B
  const rows = await db('schemes as sc')
    .select('sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .orderBy('st.step_number', 'asc')
    .where('sc.scheme_id', scheme_id)


  const result = rows.reduce((acc, row) => {
    if (row.instructions) {
      acc.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions
      })
    }
    return acc
  }, {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: []
  })
  return result
}

function findSteps(scheme_id) { // EXERCISE C
  const rows = db('steps as st')
    .select('st.step_id',
      'step_number',
      'instructions',
      'sc.scheme_name')
      .join('schemes as sc',
        'st.scheme_id',
        'sc.scheme_id'
      )
      .where('sc.scheme_id',scheme_id)
      .orderBy('step_number','asc')
  return rows
}



async function add(scheme) { // EXERCISE D

  return await db('schemes')
  .insert(scheme)
  .then(([id])=>{
    return checkID(id)
  })
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
  return db('steps').insert({
    ...step,
    scheme_id
  })
  .then(()=>{
    return db('steps as st')
    .join('schemes as sc','sc.scheme_id','st.scheme_id')
    .select('step_id','step_number','instructions','scheme_name')
    .where('sc.scheme_id',scheme_id)
    .orderBy('step_number','asc')
  })
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  checkID,
}
