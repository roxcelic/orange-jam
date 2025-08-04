"use client"
// main
export default function Home(currentPage, titlebar, content) {
    return (
        <div className="main">
        <fieldset className="content">
          <legend>
            {currentPage}
          </legend>
  
          <div className="inner">
            <div className="titleBar">
              <div className="titleBarLinks">
                {
                  titlebar
                }
              </div>
              
              <hr />
                
            </div>
            <div className="page">
              {content}
            </div>
          </div>
  
          <div className="sideBar" />       
        </fieldset>
      </div>
    );
}