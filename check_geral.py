import pandas as pd

file_path = '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2024.xlsx'

print("=" * 80)
print("ANÁLISE DA ABA 'Geral' - Videoaulas 2024")
print("=" * 80)

df = pd.read_excel(file_path, sheet_name='Geral')

print(f"\nTotal de linhas: {len(df)}")
print(f"Total de colunas: {len(df.columns)}")

print(f"\nColunas:")
for i, col in enumerate(df.columns, 1):
    print(f"  {i}. {col}")

print(f"\nPrimeiras 5 linhas:")
print(df.head(5).to_string())

print(f"\nÚltimas 5 linhas:")
print(df.tail(5).to_string())

# Contar linhas não vazias
non_empty = df.dropna(subset=['Título da aula'], how='all') if 'Título da aula' in df.columns else df.dropna(how='all')
print(f"\nLinhas com título não vazio: {len(non_empty)}")

# Verificar valores únicos em colunas importantes
if 'CÓD' in df.columns:
    unique_codes = df['CÓD'].dropna().unique()
    print(f"\nCódigos de disciplina únicos: {len(unique_codes)}")
    print(f"Exemplos: {list(unique_codes[:10])}")

