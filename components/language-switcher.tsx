"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Globe } from "lucide-react"

type Language = "en" | "sw"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Function to get language name in the current language
  const getLanguageName = (lang: Language): string => {
    if (lang === "en") {
      return language === "en" ? "English" : "Kiingereza"
    } else {
      return language === "en" ? "Swahili" : "Kiswahili"
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "8px 12px",
          backgroundColor: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span>{getLanguageName(language)}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            minWidth: "120px",
          }}
        >
          <button
            onClick={() => changeLanguage("en")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              backgroundColor: language === "en" ? "var(--accent)" : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {getLanguageName("en")}
          </button>
          <button
            onClick={() => changeLanguage("sw")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              backgroundColor: language === "sw" ? "var(--accent)" : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {getLanguageName("sw")}
          </button>
        </div>
      )}
    </div>
  )
}
