import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import myImg from './images/user.png'
import thumbnail1 from './images/thumbnail1.png'
import thumbnail2 from './images/thumbnail2.png'

function App() {
  const containerRef = useRef(null);

  const jsonDataArray =[
    {
      "baseImg": "./images/sample-1.png",
      "povHeader": "Hello CodeSandbox - This is main Header",
      "subHeader": "PDF Download POC",
      "povTable": [
        {
          "name": "first Pov",
          "description" :"first Desc"
        }
      ],
      "zones": [
        {
          "thumbNail": "./images/thumbnail1.png",
          "x1": "50", //Left
          "y1": "20", //top
          "x2": "100",
          "y2": "100"
        },
        {
          "thumbNail": "./images/thumbnail2.png",
          "x1": "100",
          "y1": "5",
          "x2": "50",
          "y2": "40"
        }
      ]
    },
    {
      "baseImg": "./images/wallpaper.png",
      "povHeader": "Hello CodeSandbox - This is main Header",
      "subHeader": "PDF Download POC",
      "povTable": [
        {
          "name": "sec Pov",
          "description" :"sec Desc"
        }
      ],
      "zones": [
        {
          "thumbNail": "./images/thumbnail1.png",
          "x1": "50", //Left
          "y1": "20", //top
          "x2": "150",
          "y2": "100"
        },
        {
          "thumbNail": "./images/thumbnail2.png",
          "x1": "50", //Left
          "y1": "20", //top
          "x2": "100",
          "y2": "100"
        }
      ]
    },
    {
      "baseImg": "./images/hd-wallpaper.png",
      "povHeader": "Hello CodeSandbox - This is main Header",
      "subHeader": "PDF Download POC",
      "povTable": [
        {
          "name": "third Pov",
          "description" :"third Desc"
        }
      ],
      "zones": [
        {
          "thumbNail": "./images/thumbnail1.png",
          "x1": "50", //Left
          "y1": "20", //top
          "x2": "100",
          "y2": "100"
        },
        {
          "thumbNail": "./images/thumbnail2.png",
          "x1": "75", //Left
          "y1": "20", //top
          "x2": "150",
          "y2": "100"
        }
      ]
    }
    ,
    {
      "baseImg": "./images/uhd-wallpaper.png",
      "povHeader": "Hello CodeSandbox - This is main Header",
      "subHeader": "S Download POC",
      "povTable": [
        {
          "name": "fourth Pov",
          "description" :"fourth Desc"
        }
      ],
      "zones": [
        {
          "thumbNail": "./images/thumbnail1.png",
          "x1": "50", //Left
          "y1": "20", //top
          "x2": "100",
          "y2": "100"
        },
        {
          "thumbNail": "./images/thumbnail2.png",
          "x1": "100",
          "y1": "5",
          "x2": "50",
          "y2": "40"
        }
      ]
    }
    // Add more JSON data as needed
  ];

  const generatePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4", true);
    const options = { scale: 1 };

    for (let i = 0; i < jsonDataArray.length; i++) {
      const jsonData = jsonDataArray[i];
      const container = document.getElementById(`container${i}`);
      const canvas = await html2canvas(container, options);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = pdfWidth / canvas.width;
      const imgHeight = canvas.height * ratio;

      if (i > 0) {
        pdf.addPage();
      }

      console.log(imgHeight,"imgHeight",pdfHeight ,"pdfHeight", "-->Condition", imgHeight > pdfHeight,"imgHeight > pdfHeight")
       // Check if the image height exceeds the current PDF page height
      if (imgHeight > pdfHeight) {
        console.log("Img is bigger than page")
        // Adjust the PDF page height to accommodate the image height
        pdf.internal.pageSize.setHeight(imgHeight);
      }

      pdf.addImage(canvas.toDataURL('image/jpeg'), 'PNG', 0, 0, pdfWidth, imgHeight);
    }

    pdf.save('output.pdf');
  };
  
  return ( 
    <>
     {jsonDataArray.map((jsonData, index) => (
      <div id={`container${index}`} ref={containerRef} className="container" style={{textAlign:"center"}}>
        <h1 style={{color:"blue"}}>{jsonData.povHeader} - Header</h1>
        <h2 style={{color:"blue", fontSize:"48px"}}>{jsonData.subHeader}</h2>
        {/* main conatiner for images  */}
        <div style={{position:"relative", margin: "auto"}}>
          <img
            src={require(`${jsonData.baseImg}`)}
            alt="user image"
            style={{ 
              border: "1px solid black", 
              width: '100%',
              height: 'auto', 
              maxHeight:"100%",
            }}
          />
          {jsonData.zones.map((zone, idx) => {
            const zoneWidth = Math.abs(zone.x2 - zone.x1) // Calculate width
            const zoneHeight = Math.abs(zone.y2 - zone.y1) // Calculate height
            console.log(zoneWidth , "ZoneWidth", zoneHeight, "ZoneHeight")
            return (
              <div key={idx} 
                style={{ position: 'absolute', 
                top: `${zone.y1}px`, 
                left: `${zone.x1}px`,
                width: `${zoneWidth}px`, 
                height: `${zoneHeight}px`}}
              >
                <img 
                  src={require(`${zone.thumbNail}`)} 
                  alt={`Thumbnail ${idx + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', border:"1px solid red" }} 
                />
              </div>
              );
            })}

            {/* Add POV table */}
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex:"1" }}>
            <table style={{ border: '1px solid black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {jsonData.povTable.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          </div>
      </div>
      ))}
    <div onClick={() => generatePDF()} style={{padding:"20px", border:"1px solid blue", display:"flex", justifyContent:"center"}}>
      <button style={{borderRadius:"10px", padding: "12px", margin:"12px", cursor:"pointer"}}>Download PDF</button>
    </div>    
    </>
  );
}

export default App;
