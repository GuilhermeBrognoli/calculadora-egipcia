
import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  PaperProvider,
  Button,
  Text,
  Surface,
  MD3LightTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const tema = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#A87B32',
  },
};

function Calculadora() {
  const [display, setDisplay] = useState('0');
  const [anterior, setAnterior] = useState(null);
  const [operacao, setOperacao] = useState(null);
  const [novoNumero, setNovoNumero] = useState(false);
  const [historico, setHistorico] = useState('');

  function adicionarNumero(numero) {
    if (display === 'Erro' || novoNumero) {
      setDisplay(numero === '.' ? '0.' : numero);
      setNovoNumero(false);
      return;
    }

    if (numero === '.' && display.includes('.')) return;

    if (numero === '.') {
      setDisplay(display + '.');
    } else {
      setDisplay(display === '0' ? numero : display + numero);
    }
  }

  function calcular(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? null : a / b;
      default: return b;
    }
  }

  function formatar(numero) {
    if (numero === null || !Number.isFinite(numero)) {
      return 'Erro';
    }

    return String(Number(numero.toPrecision(12)));
  }

  function selecionarOperacao(op) {
    if (display === 'Erro') return;

    if (operacao && !novoNumero) {
      const resultado = calcular(
        anterior,
        Number(display),
        operacao
      );

      const texto = formatar(resultado);
      setDisplay(texto);

      if (texto === 'Erro') {
        setAnterior(null);
        setOperacao(null);
        setHistorico('Divisão por zero');
        setNovoNumero(true);
        return;
      }

      setAnterior(Number(texto));
      setHistorico(`${texto} ${op}`);
    } else {
      setAnterior(Number(display));
      setHistorico(`${display} ${op}`);
    }

    setOperacao(op);
    setNovoNumero(true);
  }

  function resultado() {
    if (operacao === null || anterior === null) return;
    if (display === 'Erro') return;

    const segundo = Number(display);
    const valor = calcular(anterior, segundo, operacao);

    setHistorico(`${anterior} ${operacao} ${segundo} =`);
    setDisplay(formatar(valor));
    setAnterior(null);
    setOperacao(null);
    setNovoNumero(true);
  }

  function limpar() {
    setDisplay('0');
    setAnterior(null);
    setOperacao(null);
    setNovoNumero(false);
    setHistorico('');
  }

  function apagar() {
    if (novoNumero || display === 'Erro') {
      setDisplay('0');
      setNovoNumero(false);
      return;
    }

    setDisplay(display.length <= 1 ? '0' : display.slice(0, -1));
  }

  function botao(rotulo, acao, tipo = 'numero') {
    const especial = tipo !== 'numero';

    const cor =
      tipo === 'limpar' ? '#B65B46' :
      tipo === 'operador' ? '#A87B32' :
      tipo === 'igual' ? '#6B6336' :
      '#FFF8E8';

    return (
      <Button
        key={rotulo}
        mode="contained"
        onPress={acao}
        contentStyle={styles.conteudoBotao}
        style={[styles.botao, { backgroundColor: cor }]}
        labelStyle={[
          styles.rotuloBotao,
          { color: especial ? '#FFFFFF' : '#5A401B' },
        ]}
      >
        {rotulo}
      </Button>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.cabecalho}>
        <Text variant="headlineSmall" style={styles.titulo}>
          𓂀 Calculadora Egípcia 𓂀
        </Text>
        <Text style={styles.simbolos}>
          𓅓 𓆣 𓇳 𓋹 𓃭
        </Text>
      </View>

      <Surface style={styles.display} elevation={2}>
        <Text style={styles.historico}>
          {historico || '𓋹'}
        </Text>
        <Text
          variant="displayMedium"
          style={styles.valor}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
      </Surface>

      <View style={styles.teclado}>
        <View style={styles.linha}>
          {botao('C', limpar, 'limpar')}
          {botao('⌫', apagar, 'limpar')}
          {botao('÷', () => selecionarOperacao('/'), 'operador')}
          {botao('×', () => selecionarOperacao('*'), 'operador')}
        </View>

        <View style={styles.linha}>
          {botao('7', () => adicionarNumero('7'))}
          {botao('8', () => adicionarNumero('8'))}
          {botao('9', () => adicionarNumero('9'))}
          {botao('−', () => selecionarOperacao('-'), 'operador')}
        </View>

        <View style={styles.linha}>
          {botao('4', () => adicionarNumero('4'))}
          {botao('5', () => adicionarNumero('5'))}
          {botao('6', () => adicionarNumero('6'))}
          {botao('+', () => selecionarOperacao('+'), 'operador')}
        </View>

        <View style={styles.linha}>
          {botao('1', () => adicionarNumero('1'))}
          {botao('2', () => adicionarNumero('2'))}
          {botao('3', () => adicionarNumero('3'))}
          {botao('=', resultado, 'igual')}
        </View>

        <View style={styles.linha}>
          {botao('0', () => adicionarNumero('0'))}
          {botao('.', () => adicionarNumero('.'))}
          {botao('𓂀', () => {}, 'operador')}
          {botao('=', resultado, 'igual')}
        </View>

        <View style={styles.linha}>
          {botao('0', () => adicionarNumero('0'))}
          {botao('.', () => adicionarNumero('.'))}
      </View>
      </View>

      <Text style={styles.rodape}>
        𓋹 A matemática dos faraós 𓋹
      </Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <Calculadora />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E2BE',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titulo: {
    color: '#69461C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  simbolos: {
    color: '#947138',
    fontSize: 22,
    marginTop: 8,
  },
  display: {
    backgroundColor: '#FFF8E9',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    marginBottom: 24,
  },
  historico: {
    color: '#947D58',
    textAlign: 'right',
    fontSize: 17,
    marginBottom: 8,
  },
  valor: {
    color: '#513713',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  teclado: {
    gap: 10,
  },
  linha: {
    flexDirection: 'row',
    gap: 8,
  },
  botao: {
    flex: 1,
    borderRadius: 12,
    margin: 0,
  },
  conteudoBotao: {
    minHeight: 56,
    paddingHorizontal: 0,
  },
  rotuloBotao: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 0,
  },
  rodape: {
    textAlign: 'center',
    color: '#806439',
    marginTop: 24,
    fontSize: 14,
  },
});
