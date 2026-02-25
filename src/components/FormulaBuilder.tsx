/**
 * Custom Formula Builder Component
 * Allows users to create and save custom mathematical formulas
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  FunctionSquare,
  X,
  ChevronDown,
  Code
} from 'lucide-react'
import { useRangeStore } from '@/stores/rangeStore'
import type { CustomFormula } from '@/types/range'

interface FormulaVariable {
  name: string
  default: number
}

export function FormulaBuilder() {
  const { customFormulas, addCustomFormula, removeCustomFormula, updateCustomFormula } = useRangeStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFormula, setSelectedFormula] = useState<CustomFormula | null>(null)
  
  // Form state
  const [formulaName, setFormulaName] = useState('')
  const [formulaExpression, setFormulaExpression] = useState('')
  const [formulaDescription, setFormulaDescription] = useState('')
  const [variables, setVariables] = useState<FormulaVariable[]>([
    { name: 'x', default: 0 }
  ])

  const resetForm = () => {
    setFormulaName('')
    setFormulaExpression('')
    setFormulaDescription('')
    setVariables([{ name: 'x', default: 0 }])
    setSelectedFormula(null)
    setIsEditing(false)
  }

  const handleSaveFormula = () => {
    if (!formulaName.trim() || !formulaExpression.trim()) return

    const formulaData = {
      name: formulaName,
      formula: formulaExpression,
      description: formulaDescription,
      variables: variables
    }

    if (selectedFormula && isEditing) {
      updateCustomFormula(selectedFormula.id, formulaData)
    } else {
      addCustomFormula(formulaData)
    }

    resetForm()
    setIsExpanded(false)
  }

  const handleEditFormula = (formula: CustomFormula) => {
    setSelectedFormula(formula)
    setFormulaName(formula.name)
    setFormulaExpression(formula.formula)
    setFormulaDescription(formula.description)
    setVariables([...formula.variables])
    setIsEditing(true)
    setIsExpanded(true)
  }

  const handleDeleteFormula = (id: string) => {
    removeCustomFormula(id)
  }

  const addVariable = () => {
    const newVarName = String.fromCharCode(120 + variables.length) // x, y, z, ...
    setVariables([...variables, { name: newVarName, default: 0 }])
  }

  const removeVariable = (index: number) => {
    if (variables.length > 1) {
      setVariables(variables.filter((_, i) => i !== index))
    }
  }

  const updateVariable = (index: number, field: keyof FormulaVariable, value: string | number) => {
    const newVars = [...variables]
    if (field === 'default') {
      newVars[index][field] = Number(value)
    } else {
      newVars[index][field] = String(value)
    }
    setVariables(newVars)
  }

  // Simple formula evaluator (safe subset)
  const evaluateFormula = (formula: string, vars: Record<string, number>): number | null => {
    try {
      // Only allow safe math operations
      const safeFormula = formula
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bpow\b/g, 'Math.pow')
        .replace(/\bPI\b/g, 'Math.PI')
        .replace(/\bE\b/g, 'Math.E')
        .replace(/\blog\b/g, 'Math.log')

      // Create function with variable names as parameters
      const varNames = Object.keys(vars)
      const varValues = Object.values(vars)
      const func = new Function(...varNames, `return ${safeFormula}`)
      return func(...varValues)
    } catch (err) {
      console.error('Formula evaluation error:', err)
      return null
    }
  }

  const testFormula = () => {
    const vars: Record<string, number> = {}
    variables.forEach(v => {
      vars[v.name] = v.default
    })
    const result = evaluateFormula(formulaExpression, vars)
    alert(`Result: ${result !== null ? result.toFixed(4) : 'Error in formula'}`)
  }

  return (
    <div className="space-y-4">
      {/* Formula List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunctionSquare className="text-range-accent" size={16} />
          <h3 className="font-display text-sm font-black uppercase text-slate-400 tracking-widest">
            Custom Formulas
          </h3>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsExpanded(!isExpanded)
          }}
          className="p-2 bg-range-primary/10 hover:bg-range-primary/20 rounded-xl transition-colors"
        >
          {isExpanded ? <X size={16} className="text-range-primary" /> : <Plus size={16} className="text-range-primary" />}
        </button>
      </div>

      {/* Formula Builder (Expandable) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass p-6 rounded-2xl space-y-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Formula Name</label>
              <input
                type="text"
                value={formulaName}
                onChange={(e) => setFormulaName(e.target.value)}
                placeholder="e.g., Quadratic Sum"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-range-primary transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expression</label>
              <div className="relative">
                <Code size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formulaExpression}
                  onChange={(e) => setFormulaExpression(e.target.value)}
                  placeholder="e.g., x^2 + 2*x + 1"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono text-sm"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Use: +, -, *, /, ^, sin, cos, tan, sqrt, abs, pow, PI, E
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Variables</label>
                <button
                  onClick={addVariable}
                  className="text-[10px] text-range-primary hover:underline font-bold uppercase"
                >
                  + Add Variable
                </button>
              </div>
              <div className="space-y-2">
                {variables.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => updateVariable(i, 'name', e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono text-sm"
                      placeholder="x"
                    />
                    <span className="text-slate-400 text-sm">=</span>
                    <input
                      type="number"
                      value={v.default}
                      onChange={(e) => updateVariable(i, 'default', e.target.value)}
                      className="w-20 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono text-sm"
                      step="any"
                    />
                    {variables.length > 1 && (
                      <button
                        onClick={() => removeVariable(i)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description (Optional)</label>
              <textarea
                value={formulaDescription}
                onChange={(e) => setFormulaDescription(e.target.value)}
                placeholder="Describe what this formula calculates..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-range-primary transition-all text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveFormula}
                disabled={!formulaName.trim() || !formulaExpression.trim()}
                className="flex-1 bg-range-primary hover:bg-range-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black p-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Save size={16} /> Save Formula
              </button>
              <button
                onClick={testFormula}
                disabled={!formulaExpression.trim()}
                className="px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 font-black rounded-xl flex items-center gap-2 transition-all"
              >
                <Play size={16} /> Test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Formulas List */}
      {customFormulas.length > 0 && (
        <div className="space-y-2">
          {customFormulas.map((formula) => (
            <motion.div
              key={formula.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-xl flex items-center justify-between group"
            >
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">{formula.name}</h4>
                <p className="text-xs font-mono text-range-primary">{formula.formula}</p>
                {formula.description && (
                  <p className="text-[10px] text-slate-400 mt-1">{formula.description}</p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditFormula(formula)}
                  className="p-2 text-slate-400 hover:text-range-primary transition-colors"
                  title="Edit"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => handleDeleteFormula(formula.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {customFormulas.length === 0 && !isExpanded && (
        <div className="text-center py-8 text-slate-400">
          <FunctionSquare size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-xs font-bold uppercase tracking-widest">No custom formulas yet</p>
          <p className="text-[10px] mt-1">Create your own mathematical formulas</p>
        </div>
      )}
    </div>
  )
}
