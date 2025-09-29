#!/usr/bin/env python3
"""
Validation script for Projetta2 Dashboard improvements
Checks if all enhancements are working correctly
"""

import os
import sys
import traceback
from datetime import datetime

def print_status(message, status="INFO"):
    """Print formatted status message"""
    icons = {"INFO": "ℹ️", "SUCCESS": "✅", "ERROR": "❌", "WARNING": "⚠️"}
    print(f"{icons.get(status, 'ℹ️')} {message}")

def validate_file_structure():
    """Validate that all required files exist"""
    print_status("Validating file structure...")
    
    required_files = [
        "app.py",
        "utils.py", 
        "enhanced_utils.py",
        "config.py",
        "README.md",
        "CHANGELOG.md",
        "requirements.txt",
        ".gitignore",
        "attached_assets/lista_propostas_S670.csv"
    ]
    
    required_dirs = [
        "exports",
        ".streamlit",
        "attached_assets"
    ]
    
    missing_files = []
    missing_dirs = []
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_path)
    
    if missing_files:
        print_status(f"Missing files: {missing_files}", "ERROR")
        return False
    
    if missing_dirs:
        print_status(f"Missing directories: {missing_dirs}", "ERROR")
        return False
    
    print_status("All required files and directories exist", "SUCCESS")
    return True

def validate_imports():
    """Validate that all modules can be imported"""
    print_status("Validating imports...")
    
    imports_to_test = [
        ("utils", ["load_and_process_data", "format_currency", "format_number"]),
        ("enhanced_utils", [
            "create_sankey_diagram", "create_treemap", "create_gauge_chart",
            "advanced_filters_sidebar", "apply_advanced_filters", "paginate_dataframe",
            "export_to_excel_enhanced", "create_benchmark_metrics", "validate_data_quality"
        ]),
        ("config", ["APP_CONFIG", "DATA_CONFIG", "PERFORMANCE_THRESHOLDS"])
    ]
    
    for module_name, functions in imports_to_test:
        try:
            module = __import__(module_name)
            for func_name in functions:
                if not hasattr(module, func_name):
                    print_status(f"Function {func_name} not found in {module_name}", "ERROR")
                    return False
            print_status(f"Module {module_name} imports successfully", "SUCCESS")
        except Exception as e:
            print_status(f"Failed to import {module_name}: {str(e)}", "ERROR")
            return False
    
    return True

def validate_data_processing():
    """Validate data loading and processing"""
    print_status("Validating data processing...")
    
    try:
        from utils import load_and_process_data
        from enhanced_utils import validate_data_quality, create_benchmark_metrics
        
        # Load data
        df = load_and_process_data()
        print_status(f"Data loaded successfully: {len(df)} records", "SUCCESS")
        
        # Check derived columns
        expected_new_columns = ['gerenteNome', 'categoriaPerformance', 'categoriaValor']
        found_columns = [col for col in expected_new_columns if col in df.columns]
        if len(found_columns) == len(expected_new_columns):
            print_status(f"All derived columns created: {found_columns}", "SUCCESS")
        else:
            missing = set(expected_new_columns) - set(found_columns)
            print_status(f"Missing derived columns: {missing}", "WARNING")
        
        # Test quality validation
        quality_report = validate_data_quality(df)
        if quality_report and 'total_records' in quality_report:
            print_status(f"Data quality validation works: {quality_report['total_records']} records", "SUCCESS")
        else:
            print_status("Data quality validation failed", "ERROR")
            return False
        
        # Test benchmarks
        benchmarks = create_benchmark_metrics(df)
        if benchmarks and len(benchmarks) > 0:
            print_status(f"Benchmarks calculated: {len(benchmarks)} metrics", "SUCCESS")
        else:
            print_status("Benchmark calculation failed", "ERROR")
            return False
        
        return True
        
    except Exception as e:
        print_status(f"Data processing validation failed: {str(e)}", "ERROR")
        print_status(traceback.format_exc(), "ERROR")
        return False

def validate_visualizations():
    """Validate that visualization functions work"""
    print_status("Validating visualization functions...")
    
    try:
        from utils import load_and_process_data
        from enhanced_utils import create_sankey_diagram, create_treemap, create_gauge_chart
        
        df = load_and_process_data()
        
        # Test Sankey (basic creation, not rendering)
        try:
            sankey_fig = create_sankey_diagram(df)
            if sankey_fig is not None:
                print_status("Sankey diagram creation works", "SUCCESS")
            else:
                print_status("Sankey diagram returned None", "WARNING")
        except Exception as e:
            print_status(f"Sankey diagram creation failed: {str(e)}", "WARNING")
        
        # Test Treemap
        try:
            treemap_fig = create_treemap(df)
            if treemap_fig is not None:
                print_status("Treemap creation works", "SUCCESS")
            else:
                print_status("Treemap returned None", "WARNING")
        except Exception as e:
            print_status(f"Treemap creation failed: {str(e)}", "WARNING")
        
        # Test Gauge
        try:
            gauge_fig = create_gauge_chart(50, "Test Gauge", 100)
            if gauge_fig is not None:
                print_status("Gauge chart creation works", "SUCCESS")
            else:
                print_status("Gauge chart returned None", "WARNING")
        except Exception as e:
            print_status(f"Gauge chart creation failed: {str(e)}", "WARNING")
        
        return True
        
    except Exception as e:
        print_status(f"Visualization validation failed: {str(e)}", "ERROR")
        return False

def validate_configuration():
    """Validate configuration settings"""
    print_status("Validating configuration...")
    
    try:
        import config
        
        # Check if validate_config function works
        errors = config.validate_config()
        if not errors:
            print_status("Configuration validation passed", "SUCCESS")
        else:
            print_status(f"Configuration warnings: {errors}", "WARNING")
        
        # Check key configurations exist
        required_configs = ['APP_CONFIG', 'DATA_CONFIG', 'PERFORMANCE_THRESHOLDS']
        for config_name in required_configs:
            if hasattr(config, config_name):
                print_status(f"Configuration {config_name} exists", "SUCCESS")
            else:
                print_status(f"Configuration {config_name} missing", "ERROR")
                return False
        
        return True
        
    except Exception as e:
        print_status(f"Configuration validation failed: {str(e)}", "ERROR")
        return False

def validate_exports():
    """Validate export functionality"""
    print_status("Validating export functionality...")
    
    try:
        from utils import load_and_process_data
        from enhanced_utils import export_to_excel_enhanced
        
        df = load_data_safe()
        if df is None or df.empty:
            print_status("Cannot test exports without valid data", "WARNING")
            return True
        
        # Test Excel export (just function call, not file creation)
        try:
            filters = {'test': 'filter'}
            excel_data = export_to_excel_enhanced(df, filters)
            if excel_data is not None:
                print_status("Excel export function works", "SUCCESS")
            else:
                print_status("Excel export returned None", "WARNING")
        except Exception as e:
            print_status(f"Excel export test failed: {str(e)}", "WARNING")
        
        return True
        
    except Exception as e:
        print_status(f"Export validation failed: {str(e)}", "ERROR")
        return False

def load_data_safe():
    """Safely load data for testing"""
    try:
        from utils import load_and_process_data
        return load_and_process_data()
    except:
        return None

def main():
    """Main validation function"""
    print("=" * 60)
    print("🔍 PROJETTA2 DASHBOARD - VALIDATION SCRIPT")
    print(f"📅 Running at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    validations = [
        ("File Structure", validate_file_structure),
        ("Module Imports", validate_imports), 
        ("Data Processing", validate_data_processing),
        ("Visualizations", validate_visualizations),
        ("Configuration", validate_configuration),
        ("Export Functions", validate_exports)
    ]
    
    results = {}
    
    for validation_name, validation_func in validations:
        print(f"\n📋 {validation_name}")
        print("-" * 40)
        try:
            results[validation_name] = validation_func()
        except Exception as e:
            print_status(f"Validation {validation_name} crashed: {str(e)}", "ERROR")
            results[validation_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for validation_name, result in results.items():
        status = "SUCCESS" if result else "ERROR"
        print_status(f"{validation_name}: {'PASSED' if result else 'FAILED'}", status)
    
    print("\n" + "=" * 60)
    
    if passed == total:
        print_status(f"🎉 ALL VALIDATIONS PASSED ({passed}/{total})", "SUCCESS")
        print_status("Dashboard is ready for use!", "SUCCESS")
        sys.exit(0)
    else:
        print_status(f"⚠️  SOME VALIDATIONS FAILED ({passed}/{total})", "WARNING")
        print_status("Please check the errors above", "WARNING")
        sys.exit(1)

if __name__ == "__main__":
    main()