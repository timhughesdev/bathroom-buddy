import React from 'react';
import './form.css'

function Form({formType, handleInputChange, formData, handleSubmit, responseMsg}) {

  return (
    <>
       
    {responseMsg && <h2>{responseMsg}</h2>}

    <div className='logincontianer'>
        <div className='loginwrapper'>
      <h2 className='press-start'>{formType}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group inputs mt-3 ">
        <svg className="login" xmlns="http://www.w3.org/2000/svg" width="44" height="40" viewBox="0 0 44 40"><g stroke="#FFDE00" fill="#3B4CCA" stroke-width="3.538" transform="translate(0 -1012.362)"><ellipse ry="8.09" rx="8.244" cy="1022.221" cx="21.555" stroke-linecap="round"></ellipse><path d="M1.858 1046.4c-.79 4.74 3.805 4.11 3.805 4.11H37.88s4.846.936 4.312-3.854c-.533-4.79-6.076-10.937-20.04-11.043-13.964-.106-19.504 6.047-20.294 10.786z"></path></g></svg>
   
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className='input'
          />
        </div>
        <div className="form-group inputs mt-3">
        <svg className="lock" xmlns="http://www.w3.org/2000/svg" width="44" height="46" viewBox="0 0 44 46"><g transform="translate(-28.15 -974.678)" stroke="#FFDE00" fill="#3B4CCA" stroke-width="3.509"><rect ry="3.136" y="995.18" x="29.903" height="23.743" width="40.491" stroke-linecap="round"></rect><path d="M49.386 1004.406v4.788" stroke-linecap="round"></path><path d="M37.073 994.83s-1.39-18.398 12.97-18.398c14.36 0 12.207 18.397 12.207 18.397"></path></g></svg>
      
              
          <input
          className='input'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className='button mt-3' type="submit">{formType}</button>
      </form> 
    </div>
    </div>
    </>
  );
}

export default Form;
