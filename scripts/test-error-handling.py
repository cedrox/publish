#!/usr/bin/env python3
"""Test script for error handling validation."""

import sys
from pathlib import Path
import importlib.util

def test_missing_worksheet():
    """Test error handling with missing worksheet."""
    print("=" * 60)
    print("TEST: Missing Worksheet")
    print("=" * 60)
    
    # Load the script as a module
    spec = importlib.util.spec_from_file_location("excel_to_json", "scripts/excel-to-json.py")
    excel_to_json = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(excel_to_json)
    
    # Save original parse_arguments
    original_parse = excel_to_json.parse_arguments
    
    # Override to use test file
    def test_parse():
        return (
            Path("data/QA-test-missing-worksheet.xlsx"),
            Path("data/test-output.json")
        )
    
    excel_to_json.parse_arguments = test_parse
    
    try:
        # Run main function
        result = excel_to_json.main()
        print(f"\nExit Code: {result}")
        
        # Check exit code
        if result == 1:
            print("✓ Script exited with error code 1")
        else:
            print("❌ Expected exit code 1, got:", result)
        
        # Check that test output file was NOT created
        if not Path("data/test-output.json").exists():
            print("✓ No output file created on error")
        else:
            print("❌ Output file should not be created on error")
            
    finally:
        # Restore original
        excel_to_json.parse_arguments = original_parse

def test_corrupted_file():
    """Test error handling with corrupted file."""
    print("\n\n" + "=" * 60)
    print("TEST: Corrupted Excel File")
    print("=" * 60)
    
    # Create a fake corrupted Excel file (just text)
    with open("data/QA-test-corrupted.xlsx", "w") as f:
        f.write("This is not a valid Excel file!")
    
    # Load the script as a module
    spec = importlib.util.spec_from_file_location("excel_to_json", "scripts/excel-to-json.py")
    excel_to_json = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(excel_to_json)
    
    # Save original parse_arguments
    original_parse = excel_to_json.parse_arguments
    
    # Override to use test file
    def test_parse():
        return (
            Path("data/QA-test-corrupted.xlsx"),
            Path("data/test-output2.json")
        )
    
    excel_to_json.parse_arguments = test_parse
    
    try:
        # Run main function
        result = excel_to_json.main()
        print(f"\nExit Code: {result}")
        
        # Check exit code
        if result == 1:
            print("✓ Script exited with error code 1")
        else:
            print("❌ Expected exit code 1, got:", result)
        
    finally:
        # Restore original and cleanup
        excel_to_json.parse_arguments = original_parse
        Path("data/QA-test-corrupted.xlsx").unlink(missing_ok=True)

if __name__ == "__main__":
    test_missing_worksheet()
    test_corrupted_file()
    
    print("\n" + "=" * 60)
    print("ERROR HANDLING TESTS COMPLETE")
    print("=" * 60)
