import pandas as pd
import json

def process_year_geral(file_path, year):
    """Processa aba Geral de um ano específico (com células mescladas)"""
    print(f"\n{'='*80}")
    print(f"Processando: {file_path} - Ano {year}")
    print(f"{'='*80}")
    
    # Ler aba Geral
    df = pd.read_excel(file_path, sheet_name='Geral')
    print(f"\nAba 'Geral': {len(df)} linhas, {len(df.columns)} colunas")
    print(f"Colunas: {list(df.columns)}")
    
    # Forward fill para células mescladas (mesmo processo de 2025)
    df = df.ffill()
    
    videoaulas = []
    
    for idx, row in df.iterrows():
        # Pular linhas sem título
        titulo = row.get('Título da aula', '')
        if pd.isna(titulo) or str(titulo).strip() == '':
            continue
        
        # Extrair código da disciplina
        codigo = row.get('CÓD', row.get('CÓD.', row.get('Código', '')))
        if pd.isna(codigo) or str(codigo).strip() == '':
            continue
        
        # Extrair semana
        semana_raw = row.get('Semanas', row.get('Semana', 0))
        semana = 0
        if pd.notna(semana_raw):
            import re
            match = re.search(r'\d+', str(semana_raw))
            if match:
                semana = int(match.group())
        
        # Extrair número da aula
        num_aula = row.get('Nº de aulas', row.get('Nº da aula', 0))
        if pd.isna(num_aula):
            num_aula = 0
        else:
            try:
                num_aula = int(num_aula)
            except:
                num_aula = 0
        
        # Extrair ID TV
        id_tv = row.get('ID (TV Cultura)', row.get('ID TV Cultura', ''))
        
        # Extrair sinopse
        sinopse = row.get('Sinopse da Videoaula', row.get('Sinopse', ''))
        
        # Extrair professor
        professor = row.get('Professor', '')
        
        videoaula = {
            'ano': year,
            'codigo_disciplina': str(codigo).strip(),
            'semana': semana,
            'numero_aula': num_aula,
            'titulo': str(titulo).strip(),
            'sinopse': str(sinopse).strip() if pd.notna(sinopse) else None,
            'professor': str(professor).strip() if pd.notna(professor) else None,
            'id_tv_cultura': str(id_tv).strip() if pd.notna(id_tv) else None,
        }
        
        videoaulas.append(videoaula)
    
    print(f"✅ Processadas: {len(videoaulas)} videoaulas")
    return videoaulas

# Processar 2024
print("\n🎬 PROCESSANDO VIDEOAULAS 2024")
videoaulas_2024 = process_year_geral(
    '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2024.xlsx',
    2024
)

# Processar 2023
print("\n🎬 PROCESSANDO VIDEOAULAS 2023")
videoaulas_2023 = process_year_geral(
    '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2023.xlsx',
    2023
)

# Combinar
all_videoaulas = videoaulas_2023 + videoaulas_2024

# Salvar
output_file = '/home/ubuntu/sistema-videoaulas-univesp/videoaulas_historical_correct.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_videoaulas, f, ensure_ascii=False, indent=2)

print(f"\n{'='*80}")
print(f"RESUMO FINAL")
print(f"{'='*80}")
print(f"2023: {len(videoaulas_2023)} videoaulas")
print(f"2024: {len(videoaulas_2024)} videoaulas")
print(f"TOTAL: {len(all_videoaulas)} videoaulas")
print(f"\nArquivo salvo: {output_file}")

# Mostrar amostra
if all_videoaulas:
    print(f"\n{'='*80}")
    print(f"AMOSTRA (primeiras 5 videoaulas)")
    print(f"{'='*80}")
    for v in all_videoaulas[:5]:
        print(f"  {v['ano']} - {v['codigo_disciplina']} - S{v['semana']}A{v['numero_aula']} - {v['titulo'][:60]}...")
