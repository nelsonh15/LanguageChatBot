#!/usr/bin/env python3
"""
Setup script for spaCy noun extraction service
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a shell command and return success status"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("Setting up spaCy noun extraction service...")
    
    # Install Python dependencies
    print("\n1. Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt"):
        print("Failed to install dependencies")
        return False
    
    # Download spaCy models
    print("\n2. Downloading spaCy language models...")
    models = [
        # Available spaCy models (verified against official documentation)
        "ca_core_news_sm", # Catalan
        "zh_core_web_sm", # Chinese (Simplified)
        "hr_core_news_sm", # Croatian
        "da_core_news_sm", # Danish
        "nl_core_news_sm", # Dutch
        "en_core_web_sm", # English
        "fi_core_news_sm", # Finnish
        "fr_core_news_sm", # French
        "de_core_news_sm", # German
        "el_core_news_sm", # Greek
        "it_core_news_sm", # Italian
        "ja_core_news_sm", # Japanese
        "ko_core_news_sm", # Korean
        "lt_core_news_sm", # Lithuanian
        "mk_core_news_sm", # Macedonian
        "nb_core_news_sm", # Norwegian Bokmål
        "pl_core_news_sm", # Polish
        "pt_core_news_sm", # Portuguese
        "ro_core_news_sm", # Romanian
        "ru_core_news_sm", # Russian
        "sl_core_news_sm", # Slovenian
        "es_core_news_sm", # Spanish
        "sv_core_news_sm", # Swedish
        "uk_core_news_sm", # Ukrainian
    ]
    
    # Models that don't exist in spaCy (commented out for reference):
    # "af_core_web_sm", # Afrikaans - not available
    # "ar_core_news_sm", # Arabic - not available
    # "hy_core_news_sm", # Armenian - not available
    # "az_core_news_sm", # Azerbaijani - not available
    # "bn_core_news_sm", # Bengali - not available
    # "bg_core_news_sm", # Bulgarian - not available
    # "cs_core_web_sm", # Czech (corrected from cs_core_web_sm)
    # "et_core_web_sm", # Estonian - not available
    # "he_core_news_sm", # Hebrew - not available
    # "hi_core_news_sm", # Hindi - not available
    # "hu_core_web_sm", # Hungarian
    # "is_core_news_sm", # Icelandic - not available
    # "id_core_news_sm", # Indonesian - not available
    # "lv_core_news_sm", # Latvian - not available
    # "ms_core_news_sm", # Malay - not available
    # "mr_core_news_sm", # Marathi - not available
    # "ne_core_news_sm", # Nepali - not available
    # "fa_core_news_sm", # Persian - not available
    # "sr_core_news_sm", # Serbian - not available
    # "sk_core_news_sm", # Slovak - not available
    # "tl_core_news_sm", # Tagalog - not available
    # "ta_core_news_sm", # Tamil - not available
    # "th_core_news_sm", # Thai - not available
    #"tr_core_web_sm", # Turkish
    # "ur_core_news_sm", # Urdu - not available
    # "vi_core_news_sm", # Vietnamese - not available
    
    for model in models:
        print(f"Downloading {model}...")
        if not run_command(f"python -m spacy download {model}"):
            print(f"Warning: Failed to download {model}")
    
    print("\n✓ Setup complete!")
    print("\nTo start the service, run:")
    print("python noun_extractor.py")

if __name__ == "__main__":
    main()