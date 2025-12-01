import pandas as pd
import json
import re

def process_bimestre_sheets(file_path, year):
    """Processa abas de bimestres (2024.1, 2024.2, etc.) com células mescladas"""
    print(f"\n{'='*80}")
    print(f"Processando: {file_path} - Ano {year}")
    print(f"{'='*80}")
    
    excel_file = pd.ExcelFile(file_path)
    
    # Encontrar abas de bimestres
    bimestre_sheets = [s for s in excel_file.sheet_names if s.startswith(str(year))]
    print(f"\nAbas de bimestres encontradas: {bimestre_sheets}")
    
    all_videoaulas = []
    
    for sheet_name in sorted(bimestre_sheets):
        # Extrair número do bimestre
        bimestre_num = int(sheet_name.split('.')[-1])
        print(f"\n📄 Processando {sheet_name} (Bimestre {bimestre_num})...")
        
        # Ler aba
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        print(f"  Linhas: {len(df)} | Colunas: {len(df.columns)}")
        print(f"  Colunas: {list(df.columns)}")
        
        # IMPORTANTE: Forward fill para células mescladas
        # Colunas que geralmente são mescladas: Código, Disciplina
        if 'CÓD' in df.columns:
            df['CÓD'] = df['CÓD'].ffill()
        if 'CÓD.' in df.columns:
            df['CÓD.'] = df['CÓD.'].ffill()
        if 'Disciplina' in df.columns:
            df['Disciplina'] = df['Disciplina'].ffill()
        if 'cod nome' in df.columns:
            df['cod nome'] = df['cod nome'].ffill()
        
        videoaulas_count = 0
        
        for idx, row in df.iterrows():
            # Pular linhas sem título
            titulo = row.get('Título da aula', row.get('Título da videoaula', ''))
            if pd.isna(titulo) or str(titulo).strip() == '':
                continue
            
            # Extrair código (tentar diferentes nomes de coluna)
            codigo = row.get('CÓD', row.get('CÓD.', row.get('Código', row.get('cod nome', ''))))
            if pd.isna(codigo) or str(codigo).strip() == '':
                continue
            
            # Extrair semana
            semana_raw = row.get('Semanas', row.get('Semana', 0))
            semana = 0
            if pd.notna(semana_raw):
                match = re.search(r'\d+', str(semana_raw))
                if match:
                    semana = int(match.group())
            
            # Extrair número da aula
            num_aula_raw = row.get('Nº de aulas', row.get('Nº da aula', row.get('N° de aulas', 0)))
            num_aula = 0
            if pd.notna(num_aula_raw):
                try:
                    num_aula = int(num_aula_raw)
                except:
                    pass
            
            # Extrair ID TV (tentar diferentes nomes)
            id_tv = row.get('ID (TV Cultura)', row.get('ID TV Cultura', row.get('ID                         (TV Cultura)', '')))
            
            # Extrair sinopse
            sinopse = row.get('Sinopse da Videoaula', row.get('Sinopse', ''))
            
            # Extrair professor
            professor = row.get('Professor', '')
            
            videoaula = {
                'ano': year,
                'bimestre': bimestre_num,
                'codigo_disciplina': str(codigo).strip(),
                'semana': semana,
                'numero_aula': num_aula,
                'titulo': str(titulo).strip(),
                'sinopse': str(sinopse).strip() if pd.notna(sinopse) else None,
                'professor': str(professor).strip() if pd.notna(professor) and str(professor).strip() != '' else None,
                'id_tv_cultura': str(id_tv).strip() if pd.notna(id_tv) and str(id_tv).strip() != '' else None,
            }
            
            all_videoaulas.append(videoaula)
            videoaulas_count += 1
        
        print(f"  ✅ {videoaulas_count} videoaulas processadas")
    
    return all_videoaulas

# Processar 2024
print("\n🎬 PROCESSANDO VIDEOAULAS 2024")
videoaulas_2024 = process_bimestre_sheets(
    '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2024.xlsx',
    2024
)

# Processar 2023
print("\n🎬 PROCESSANDO VIDEOAULAS 2023")
videoaulas_2023 = process_bimestre_sheets(
    '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2023.xlsx',
    2023
)

# Combinar
all_videoaulas = videoaulas_2023 + videoaulas_2024

# Salvar
output_file = '/home/ubuntu/sistema-videoaulas-univesp/videoaulas_historical_final.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_videoaulas, f, ensure_ascii=False, indent=2)

print(f"\n{'='*80}")
print(f"RESUMO FINAL")
print(f"{'='*80}")
print(f"2023: {len(videoaulas_2023)} videoaulas")
print(f"2024: {len(videoaulas_2024)} videoaulas")
print(f"TOTAL: {len(all_videoaulas)} videoaulas")
print(f"\nArquivo salvo: {output_file}")

# Mostrar amostra por ano e bimestre
if all_videoaulas:
    print(f"\n{'='*80}")
    print(f"DISTRIBUIÇÃO POR ANO E BIMESTRE")
    print(f"{'='*80}")
    from collections import Counter
    dist = Counter((v['ano'], v['bimestre']) for v in all_videoaulas)
    for (ano, bim), count in sorted(dist.items()):
        print(f"  {ano}.{bim}: {count} videoaulas")
    
    print(f"\n{'='*80}")
    print(f"AMOSTRA (primeiras 5 videoaulas)")
    print(f"{'='*80}")
    for v in all_videoaulas[:5]:
        print(f"  {v['ano']}.{v['bimestre']} - {v['codigo_disciplina']} - S{v['semana']}A{v['numero_aula']} - {v['titulo'][:50]}...")
