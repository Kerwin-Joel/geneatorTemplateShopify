import { useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [archivoInput, setArchivoInput] = useState(null);
  const [mensaje, setMensaje] = useState([]);
  const [productoSKU, setProductoSKU] = useState([]);
  const [url, setURL] = useState([]);
  const [urlModify, setURLModify] = useState([]);
  const [productos, setProductos] = useState([]);
  const [csvFinal, setCSVFinal] = useState([]);

  const manejarCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    setArchivoInput(archivo);
  };

  const obtenerSKUDeCsv = () =>{

    if (archivoInput) {
      Papa.parse(archivoInput, {
        
        complete: (resultado) => {

          const productosObjetos = resultado.data.filter(producto => producto.SKU !== '');
          console.log(productosObjetos)
          setProductos(productosObjetos)
          const nuevosSKU = productosObjetos.map(producto => producto.SKU);
          console.log(nuevosSKU)
          setProductoSKU(nuevosSKU);

        },
        header: true,
        encoding: "ISO-8859-1",
      });
    }
  }

  useEffect(() => {

    if (productoSKU.length > 0) productoSKU.map( async sku => realizarConsultaFetch(sku))
  }, [productoSKU]);

  useEffect(() => {

      const links = mensaje.map( elemento => elemento.image.src)
      setURL([...links])
  }, [mensaje]);

  useEffect(() => {

    const listaOrdenada = url.sort((a, b) => a.length - b.length);
    const mitadLongitud = Math.ceil(listaOrdenada.length / 2);
    const listaFinal = listaOrdenada.slice(0,mitadLongitud);

    setURLModify([...listaFinal])
  }, [url]);

  useEffect(() => {
    
    const productosRelacionados = productos.flatMap(producto => {
      const sku = producto.SKU.toLowerCase(); 
      const urlsRelacionadas = urlModify.filter(url => url.toLowerCase().includes(sku));
    
      return urlsRelacionadas.map(url => ({
        ...producto,
        IMAGEN_URL: url,
      }));
    });

    setCSVFinal(productosRelacionados)
  }, [urlModify, productos]);

  const buscarImagenesDeShopify = () => {
      obtenerSKUDeCsv();
  };

  const procesarYGenerarCSV = () => {
    const nuevasCabeceras = [
      'Handle',
      'Title',
      'Body(HTML)',
      'Vendor',
      'Product',
      'Category',
      'Type',
      'Tags',
      'Published',
      'Option1 Name',
      'Option1 Value',
      'Option2 Name',
      'Option2 Value',
      'Option3 Name',
      'Option3 Value',
      'Variant',
      'SKU',
      'Variant Grams',
      'Variant Inventory Tracker',
      'Variant Inventory Qty',
      'Variant Inventory Policy',
      'Variant Fulfillment Service',
      'Variant Price',
      'Variant Compare At Price',
      'Variant Requires Shipping',
      'Variant Taxable',
      'Variant Barcode',
      'Image Src',
      'Image Position',
      'Image Alt Text',
      'Gift Card',
      'SEO Title',
      'SEO Description',
      'Google Shopping / Google Product Category',
      'Google Shopping / Gender',
      'Google Shopping / Age Group',
      'Google Shopping / MPN',
      'Google Shopping / Condition',
      'Google Shopping / Custom Product',
      'Google Shopping / Custom Label 0',
      'Google Shopping / Custom Label 1',
      'Google Shopping / Custom Label 2',
      'Google Shopping / Custom Label 3',
      'Google Shopping / Custom Label 4',
      'Variant Image',
      'Variant Weight Unit',
      'Variant Tax Code',
      'Cost per item',
      'Included / Peru',
      'Status'
    ];
  
    const datosSalida = csvFinal.map( (fila) => {
      console.log(fila)
      const nuevaFila = nuevasCabeceras.map((cabecera) => {
        if (cabecera === 'Status') {
          return 'active';
        }
        else if (cabecera === 'Included / Peru') {
          return 'TRUE';
        }
        else if (cabecera === 'Cost per item') {
          return normalizeText(fila['COSTO']);
        }
        else if (cabecera === 'Variant Tax Code') {
          return '';
        }
        else if (cabecera === 'Variant Weight Unit') {
          return 'kg';
        }
        else if (cabecera === 'Variant Image') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Label 4') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Label 3') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Label 2') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Label 1') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Label 0') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Custom Product') {
          return 'VERDADERO';
        } 
        else if (cabecera === 'Google Shopping / Condition') {
          return '';
        }
        else if (cabecera === 'Google Shopping / MPN') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Age Group') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Gender') {
          return '';
        }
        else if (cabecera === 'Google Shopping / Google Product Category') {
          return '';
        }
        else if (cabecera === 'SEO Description') {
          return `Encuentra lo mejor para tu bebé de ${fila['MARCA']} al mejor precio en Tutti Tienda. Recibe tu pedido en cualquier parte del Perú`;
        } 
        else if (cabecera === 'SEO Title') {
          return fila['NOMBRE DEL PRODUCTO'];
        } 
        else if (cabecera === 'Gift Card') {
          return 'FALSE';
        } 
        else if (cabecera === 'Image Alt Text') {
          return formatHandle(fila['NOMBRE DEL PRODUCTO']);
        } 
        // else if (cabecera === 'Image Position') {
        //   return '';
        // } 
        else if (cabecera === 'Image Src') {
          return fila['IMAGEN_URL'];
        } 
        else if (cabecera === 'Variant Barcode') {
          return '';
        } 
        else if (cabecera === 'Variant Taxable') {
          return 'TRUE';
        } 
        else if (cabecera === 'Variant Requires Shipping') {
          return 'TRUE';
        } 
        else if (cabecera === 'Variant Compare At Price') {
          return '';
        } 
        else if (cabecera === 'Variant Price') {
          return fila['PVP'];
        } 
        else if (cabecera === 'Variant Fulfillment Service') {
          return 'manual';
        } 
        else if (cabecera === 'Variant Inventory Policy') {
          return 'deny';
        } 
        else if (cabecera === 'Variant Inventory Qty') {
          return 'consultar por el stock a diego';
        } 
        else if (cabecera === 'Variant Inventory Tracker') {
          return 'shopify';
        } 
        else if (cabecera === 'Variant Grams') {
          return '0';
        } 
        else if (cabecera === 'Variant SKU') {
          return fila['SKU'];
        } 
        else if (cabecera === 'Option3 Value') {
          return '';
        } 
        else if (cabecera === 'Option3 Name') {
          return '';
        } 
        else if (cabecera === 'Option2 Value') {
          return '';
        } 
        else if (cabecera === 'Option2 Name') {
          return '';
        } 
        else if (cabecera === 'Option1 Value') {
          return 'Default Title';
        } 
        else if (cabecera === 'Option1 Name') {
          return 'Title';
        } 
        else if (cabecera === 'Published') {
          return 'TRUE';
        } 
        // else if (cabecera === 'Tags') {
        //   return 'FALTA';
        // } 
        // else if (cabecera === 'Type') {
        //   return 'FALTA';
        // } 
        // else if (cabecera === 'Product Category') {
        //   return 'FALTA';
        // } 
        else if (cabecera === 'Vendor') {
          return fila['MARCA'];
        }
        else if (cabecera === 'Body(HTML)') {

          return `"${fila['DESCRIPCIÓN']}"`;
          // return fila['DESCRIPCI�N'];
          // return `xd`;
        }
        else if (cabecera === 'Title') {
          return formatTitle(fila['NOMBRE DEL PRODUCTO'],fila['MARCA']);
        } 
        else if (cabecera === 'Handle') {
          return formatHandle(fila['NOMBRE DEL PRODUCTO'])
        }
        else {
          return fila[cabecera] || '';
        }
      });
  
      return nuevaFila;
    });
  
    const csvSalida = [nuevasCabeceras.join(',')].concat(
      datosSalida.map((fila) => fila.join(','))
    ).join('\n');
  
    descargarCSV(csvSalida, 'datos_salida.csv');
  };

  const descargarCSV = (csv, nombreArchivo) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, nombreArchivo);
    } else {
      enlace.href = URL.createObjectURL(blob);
      enlace.target = '_blank';
      enlace.download = nombreArchivo;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    }
  };

  const normalizeText = (text) => {
    return text ? text.replace(/[\r\n]+/g, ' ').replace(/,/g, '|') : ''; 
  };

  const formatHandle = (text) => {
    const inputTextArrayUnderScore = text.split('-')
    const textsArrayClean = inputTextArrayUnderScore.map(element =>{
      return element.trimStart().trimEnd().replace(/\s+/g, '-')
      
    })
    return textsArrayClean.join('-')
  };

  const formatTitle = (producto,marca) => { 
    return `${producto}-${marca}`
  };

  const realizarConsultaFetch = async (sku) => {

    try {
      const response = await fetch(`http://localhost:3001/shopify?SKU=${sku}`);
      
      if (!response.ok) throw new Error(`Error en la consulta: ${response.statusText}`);
      
      const data = await response.json();

      setMensaje( prevContent =>[...[...prevContent],...data] )
    
    } catch (error) {
      console.error('Error en la consulta Fetch:', error);
    }
  };


  return (
    <div>
      <h1>Procesar CSV</h1>
        <label id="largeFile" htmlFor="file">
          <input type="file" onChange={manejarCambioArchivo} id='file' />
        </label>
      <div className='container_buttons'>
        <button onClick={buscarImagenesDeShopify}>Procesar productos</button>
        <button onClick={procesarYGenerarCSV}>Descargar CSV</button>
      </div> 
      {
        urlModify && (
          <div>
            { urlModify.length > 2  && <h2>Mensaje de la Consulta:</h2> }
              <ul>
                {urlModify.map((elemento, index) => (
                    <li key={index}>{JSON.stringify(elemento)}</li>
                  ))
                  
                }
              </ul>
          </div>
          )
      }
    </div>
  );
}

export default App;


