from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import requests
from datetime import datetime
from typing import List, Dict, Any
import uvicorn
import xlsxwriter
import os

app = FastAPI(title="CRM Risk Manager - Analytics & Reports Service")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL do backend Spring Boot
BACKEND_URL = "http://localhost:8080/api"

def translate_status(status):
    """Traduz status do inglês para português"""
    status_map = {
        'ACTIVE': 'SEGURO',
        'HIGH_RISK': 'ALTO RISCO',
        'OVERDUE': 'ATRASADO!'
    }
    return status_map.get(status, status)

class CustomerData(BaseModel):
    id: str
    name: str
    email: str
    riskScore: float
    status: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Analytics & Reports"}

@app.get("/analytics/dashboard-data")
async def get_dashboard_analytics():
    """Busca dados do backend e retorna análises"""
    try:
        # Buscar dados do Spring Boot
        response = requests.get(f"{BACKEND_URL}/customers")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Erro ao buscar dados do backend")
        
        customers = response.json()
        
        if not customers:
            return {"message": "Nenhum dado encontrado"}
        
        # Análises básicas usando Python puro
        total_customers = len(customers)
        risk_scores = [c['riskScore'] for c in customers]
        avg_risk = sum(risk_scores) / len(risk_scores)
        high_risk_count = len([c for c in customers if c['riskScore'] >= 0.7])
        
        # Distribuição por status
        status_dist = {}
        for customer in customers:
            status = customer['status']
            status_dist[status] = status_dist.get(status, 0) + 1
        
        # Análise de risco por faixas
        risk_distribution = {"Baixo": 0, "Médio": 0, "Alto": 0, "Crítico": 0}
        for customer in customers:
            score = customer['riskScore']
            if score < 0.3:
                risk_distribution["Baixo"] += 1
            elif score < 0.7:
                risk_distribution["Médio"] += 1
            elif score < 0.9:
                risk_distribution["Alto"] += 1
            else:
                risk_distribution["Crítico"] += 1
        
        return {
            "total_customers": total_customers,
            "average_risk_score": round(avg_risk, 3),
            "high_risk_customers": high_risk_count,
            "status_distribution": status_dist,
            "risk_distribution": risk_distribution,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise: {str(e)}")

@app.get("/charts/risk-distribution")
async def generate_risk_chart():
    """Gera dados para gráfico de distribuição de risco"""
    try:
        response = requests.get(f"{BACKEND_URL}/customers")
        customers = response.json()
        
        if not customers:
            return {"error": "Nenhum dado encontrado"}
        
        # Criar dados para histograma
        risk_scores = [c['riskScore'] for c in customers]
        
        # Criar bins manualmente
        bins = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        histogram_data = []
        
        for i in range(len(bins) - 1):
            count = len([score for score in risk_scores if bins[i] <= score < bins[i+1]])
            histogram_data.append({
                "range": f"{bins[i]:.1f}-{bins[i+1]:.1f}",
                "count": count
            })
        
        return {
            "chart_data": {
                "type": "histogram",
                "title": "Distribuição de Score de Risco",
                "data": histogram_data
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

@app.get("/charts/status-pie")
async def generate_status_pie_chart():
    """Gera dados para gráfico de pizza com status dos clientes"""
    try:
        response = requests.get(f"{BACKEND_URL}/customers")
        customers = response.json()
        
        # Contar status
        status_counts = {}
        for customer in customers:
            status = customer['status']
            status_counts[status] = status_counts.get(status, 0) + 1
        
        pie_data = [{"label": k, "value": v} for k, v in status_counts.items()]
        
        return {
            "chart_data": {
                "type": "pie",
                "title": "Distribuição por Status",
                "data": pie_data
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")



@app.get("/reports/risk-summary")
async def generate_risk_summary():
    """Gera relatório resumido de análise de risco"""
    try:
        response = requests.get(f"{BACKEND_URL}/customers")
        customers = response.json()
        
        # Análises detalhadas
        total = len(customers)
        critical_risk = len([c for c in customers if c['riskScore'] >= 0.9])
        high_risk = len([c for c in customers if 0.7 <= c['riskScore'] < 0.9])
        medium_risk = len([c for c in customers if 0.4 <= c['riskScore'] < 0.7])
        low_risk = len([c for c in customers if c['riskScore'] < 0.4])
        
        # Top 5 clientes de maior risco
        sorted_customers = sorted(customers, key=lambda x: x['riskScore'], reverse=True)
        top_risk = []
        for customer in sorted_customers[:5]:
            top_risk.append({
                "name": customer['name'],
                "email": customer['email'],
                "riskScore": customer['riskScore'],
                "status": customer['status']
            })
        
        # Recomendações baseadas nos dados
        recommendations = []
        if critical_risk > 0:
            recommendations.append(f"🚨 {critical_risk} clientes em situação crítica (>90%) - Ação imediata necessária")
        if high_risk > 0:
            recommendations.append(f"⚠️ {high_risk} clientes de alto risco (70-90%) - Monitoramento intensivo")
        if medium_risk > total * 0.5:
            recommendations.append("📊 Muitos clientes em risco médio - Implementar campanhas preventivas")
        
        avg_score = sum([c['riskScore'] for c in customers]) / total if total > 0 else 0
        
        return {
            "summary": {
                "total_customers": total,
                "critical_risk": critical_risk,
                "high_risk": high_risk,
                "medium_risk": medium_risk,
                "low_risk": low_risk,
                "average_score": round(avg_score, 3)
            },
            "top_risk_customers": top_risk,
            "recommendations": recommendations,
            "generated_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar relatório: {str(e)}")

@app.get("/analytics/trends")
async def get_risk_trends():
    """Análise de tendências de risco"""
    try:
        response = requests.get(f"{BACKEND_URL}/customers")
        customers = response.json()
        
        # Simular tendência baseada nos dados atuais
        risk_ranges = {
            "0-30%": len([c for c in customers if c['riskScore'] < 0.3]),
            "30-50%": len([c for c in customers if 0.3 <= c['riskScore'] < 0.5]),
            "50-70%": len([c for c in customers if 0.5 <= c['riskScore'] < 0.7]),
            "70-90%": len([c for c in customers if 0.7 <= c['riskScore'] < 0.9]),
            "90-100%": len([c for c in customers if c['riskScore'] >= 0.9])
        }
        
        # Calcular métricas de concentração
        total = len(customers)
        concentration_high = (risk_ranges["70-90%"] + risk_ranges["90-100%"]) / total * 100 if total > 0 else 0
        
        return {
            "risk_distribution": risk_ranges,
            "metrics": {
                "high_risk_concentration": round(concentration_high, 1),
                "total_analyzed": total,
                "analysis_date": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise de tendências: {str(e)}")

@app.get("/export/customers-excel")
async def export_customers_to_excel():
    """Exporta dados dos clientes para Excel formatado e bonito"""
    try:
        response = requests.get(f"{BACKEND_URL}/customers")
        customers = response.json()
        
        # Criar arquivo Excel
        filename = f"relatorio_clientes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        filepath = f"reports/{filename}"
        
        # Criar diretório se não existir
        os.makedirs("reports", exist_ok=True)
        
        # Criar workbook
        workbook = xlsxwriter.Workbook(filepath)
        
        # Definir formatos
        title_format = workbook.add_format({
            'bold': True,
            'font_size': 16,
            'align': 'center',
            'bg_color': '#4472C4',
            'font_color': 'white'
        })
        
        header_format = workbook.add_format({
            'bold': True,
            'font_size': 12,
            'align': 'center',
            'bg_color': '#D9E2F3',
            'border': 1
        })
        
        critical_format = workbook.add_format({
            'align': 'center',
            'border': 1,
            'bg_color': '#FFCDD2',
            'font_color': '#D32F2F'
        })
        
        high_format = workbook.add_format({
            'align': 'center',
            'border': 1,
            'bg_color': '#FFF3CD',
            'font_color': '#856404'
        })
        
        low_format = workbook.add_format({
            'align': 'center',
            'border': 1,
            'bg_color': '#D4EDDA',
            'font_color': '#155724'
        })
        
        cell_format = workbook.add_format({
            'align': 'center',
            'border': 1
        })
        
        # Criar planilha
        worksheet = workbook.add_worksheet('Clientes')
        
        # Título
        worksheet.merge_range('A1:H1', 'CRM RISK MANAGER - RELATÓRIO DE CLIENTES', title_format)
        worksheet.merge_range('A2:H2', f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}', cell_format)
        
        # Cabeçalhos
        headers = ['ID', 'Nome', 'Email', 'Telefone', 'Score (%)', 'Status', 'Categoria', 'Recomendação']
        for col, header in enumerate(headers):
            worksheet.write(3, col, header, header_format)
        
        # Adicionar filtros automáticos (setas de dropdown)
        worksheet.autofilter(3, 0, 3 + len(customers), len(headers) - 1)
        
        # Congelar painéis (fixar cabeçalhos ao rolar)
        worksheet.freeze_panes(4, 0)
        
        # Ordenar por score
        sorted_customers = sorted(customers, key=lambda x: x['riskScore'], reverse=True)
        
        # Dados
        for row, customer in enumerate(sorted_customers, start=4):
            score = customer['riskScore']
            score_percent = f"{score * 100:.1f}%"
            
            # Determinar categoria e formato
            if score >= 0.9:
                category = "CRÍTICO"
                recommendation = "AÇÃO IMEDIATA"
                row_format = critical_format
            elif score >= 0.7:
                category = "ALTO"
                recommendation = "MONITORAR"
                row_format = high_format
            elif score >= 0.4:
                category = "MÉDIO"
                recommendation = "ACOMPANHAR"
                row_format = cell_format
            else:
                category = "BAIXO"
                recommendation = "NORMAL"
                row_format = low_format
            
            # Escrever dados
            worksheet.write(row, 0, customer['id'], row_format)
            worksheet.write(row, 1, customer['name'], row_format)
            worksheet.write(row, 2, customer['email'], row_format)
            worksheet.write(row, 3, customer.get('phone', 'N/A'), row_format)
            worksheet.write(row, 4, score_percent, row_format)
            worksheet.write(row, 5, translate_status(customer['status']), row_format)
            worksheet.write(row, 6, category, row_format)
            worksheet.write(row, 7, recommendation, row_format)
        
        # Ajustar largura das colunas
        worksheet.set_column('A:A', 8)   # ID
        worksheet.set_column('B:B', 20)  # Nome
        worksheet.set_column('C:C', 25)  # Email
        worksheet.set_column('D:D', 15)  # Telefone
        worksheet.set_column('E:E', 12)  # Score
        worksheet.set_column('F:F', 15)  # Status
        worksheet.set_column('G:G', 12)  # Categoria
        worksheet.set_column('H:H', 18)  # Recomendação
        
        workbook.close()
        
        return FileResponse(
            path=filepath,
            filename=filename,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao exportar Excel: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)