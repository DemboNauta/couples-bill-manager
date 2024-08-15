from lxml import etree
from typing import List, Tuple

def process_xml(xml_file: str) -> List[Tuple[str, str, str, str]]:
    # Parsear el archivo XML
    tree = etree.parse(xml_file)
    root = tree.getroot()

    # Espacios de nombres definidos en el XML
    namespaces = {
        'o': 'urn:schemas-microsoft-com:office:office',
        'x': 'urn:schemas-microsoft-com:office:excel',
        'ss': 'urn:schemas-microsoft-com:office:spreadsheet'
    }

    # Encontrar el elemento Worksheet
    worksheet = root.find('ss:Worksheet', namespaces)

    # Si se encuentra el Worksheet
    if worksheet is not None:
        name = worksheet.get('{urn:schemas-microsoft-com:office:spreadsheet}Name')
        print(f'Worksheet Name: {name}')

        # Acceder a las filas del Worksheet
        rows = worksheet.findall('.//ss:Row', namespaces)
        total = []

        for row in rows:
            cells = row.findall('ss:Cell', namespaces)
            linea = []
            
            for cell in cells:
                data = cell.find('ss:Data', namespaces)
                if data is not None:
                    linea.append(data.text)
                    
            if len(linea) > 0 and linea[0] is not None:
                total.append(linea)

        gastos = []
        nombre_ancho = 50
        categoria_ancho = 40
        gasto_ancho = 10
        fecha_ancho = 20

        print(f"{'NOMBRE'.ljust(nombre_ancho)}{'CATEGORIA'.ljust(categoria_ancho)}{'GASTO'.rjust(gasto_ancho)}{'FECHA'.ljust(fecha_ancho)}")
        print('-' * (nombre_ancho + categoria_ancho + gasto_ancho + fecha_ancho))

        for linea in total:
            if len(linea) > 3:
                if 'Gasto' in linea[4]:
                    contenido = (linea[1], linea[2], linea[3], linea[0])  # Añadido linea[0] para la fecha
                    gastos.append(contenido)
                    print(linea)
                    print(f"{linea[1].ljust(nombre_ancho)}{linea[2].ljust(categoria_ancho)}{linea[3].rjust(gasto_ancho)}€{linea[0].ljust(fecha_ancho)}")

        print('------------')
        gastos.sort(key=lambda x: float(x[2]), reverse=True)

        for gasto in gastos:
            print(gasto)

        return gastos

    else:
        print('Worksheet not found')
        return []


