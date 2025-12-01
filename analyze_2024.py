import pandas as pd

file_path = '/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2024.xlsx'
excel_file = pd.ExcelFile(file_path)

print("=" * 80)
print("ANÁLISE DETALHADA: Videoaulas 2024.xlsx")
print("=" * 80)

print(f"\n📋 ABAS DISPONÍVEIS ({len(excel_file.sheet_names)}):")
for i, sheet in enumerate(excel_file.sheet_names, 1):
    print(f"  {i}. {sheet}")

print("\n" + "=" * 80)
print("ANÁLISE POR ABA")
print("=" * 80)

total_rows = 0

for sheet_name in excel_file.sheet_names:
    print(f"\n📄 ABA: {sheet_name}")
    print("-" * 80)
    
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    print(f"  Total de linhas: {len(df)}")
    print(f"  Total de colunas: {len(df.columns)}")
    print(f"\n  Colunas:")
    for col in df.columns:
        print(f"    - {col}")
    
    # Contar linhas não vazias
    non_empty = df.dropna(how='all')
    print(f"\n  Linhas não completamente vazias: {len(non_empty)}")
    
    # Mostrar primeiras 3 linhas
    print(f"\n  Primeiras 3 linhas:")
    print(df.head(3).to_string())
    
    total_rows += len(df)

print("\n" + "=" * 80)
print(f"TOTAL DE LINHAS EM TODAS AS ABAS: {total_rows}")
print("=" * 80)
